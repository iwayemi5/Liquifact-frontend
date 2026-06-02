import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import UploadZone from './UploadZone';

function createMockFile(name = 'invoice.pdf', type = 'application/pdf') {
  return new File(['mock content'], name, { type });
}

function createMockTextFile(name = 'test.txt') {
  return new File(['mock content'], name, { type: 'text/plain' });
}

function createMockLargeFile(sizeMb = 11) {
  const size = sizeMb * 1024 * 1024;
  const content = new ArrayBuffer(size);
  return new File([content], 'large.pdf', { type: 'application/pdf' });
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('UploadZone', () => {
  it('renders constraint notice and drop zone in idle state', () => {
    render(<UploadZone />);

    expect(
      screen.getByRole('note', { name: /file upload requirements/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /drop pdf invoice/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /upload & tokenize invoice/i })
    ).toBeDisabled();
  });

  it('shows file info after valid file selection', () => {
    render(<UploadZone />);

    const file = createMockFile();
    const input = screen.getByLabelText(/select pdf invoice file/i);
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('invoice.pdf')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /upload & tokenize invoice/i })
    ).toBeEnabled();
  });

  it('shows validation error for non-PDF file', () => {
    render(<UploadZone />);

    const file = createMockTextFile();
    const input = screen.getByLabelText(/select pdf invoice file/i);
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByRole('alert')).toHaveTextContent(/invalid file type/i);
    expect(
      screen.getByRole('button', { name: /upload & tokenize invoice/i })
    ).toBeDisabled();
  });

  it('shows validation error for oversized file', () => {
    render(<UploadZone />);

    const file = createMockLargeFile();
    const input = screen.getByLabelText(/select pdf invoice file/i);
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByRole('alert')).toHaveTextContent(/exceeds/);
    expect(
      screen.getByRole('button', { name: /upload & tokenize invoice/i })
    ).toBeDisabled();
  });

  it('progresses through uploading, tokenizing, and success on submit', async () => {
    render(<UploadZone />);

    const file = createMockFile();
    const input = screen.getByLabelText(/select pdf invoice file/i);
    fireEvent.change(input, { target: { files: [file] } });

    const submitBtn = screen.getByRole('button', {
      name: /upload & tokenize invoice/i,
    });
    fireEvent.click(submitBtn);

    expect(
      screen.getByRole('status')
    ).toHaveTextContent(/uploading invoice/i);
    expect(submitBtn).toBeDisabled();

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(
      screen.getByRole('status')
    ).toHaveTextContent(/pending tokenization/i);
    expect(submitBtn).toBeDisabled();

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(
      screen.getByRole('status')
    ).toHaveTextContent(/queued for tokenization/i);
    expect(submitBtn).toBeEnabled();
  });

  it('uses role="status" with aria-live for progress announcements', async () => {
    render(<UploadZone />);

    const file = createMockFile();
    const input = screen.getByLabelText(/select pdf invoice file/i);
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(
      screen.getByRole('button', { name: /upload & tokenize invoice/i })
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('status')).toHaveTextContent(/uploading invoice/i);

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByRole('status')).toHaveTextContent(
      /pending tokenization/i
    );

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByRole('status')).toHaveTextContent(
      /queued for tokenization/i
    );
  });

  it('prevents double-submission during processing', async () => {
    render(<UploadZone />);

    const file = createMockFile();
    const input = screen.getByLabelText(/select pdf invoice file/i);
    fireEvent.change(input, { target: { files: [file] } });

    const submitBtn = screen.getByRole('button', {
      name: /upload & tokenize invoice/i,
    });
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent(/uploading invoice/i);
  });

  it('opens file dialog on Enter key on the drop zone', () => {
    render(<UploadZone />);

    const dropZone = screen.getByRole('button', { name: /drop pdf invoice/i });
    const input = screen.getByLabelText(/select pdf invoice file/i);
    const clickSpy = jest.spyOn(input, 'click').mockImplementation(() => {});

    fireEvent.keyDown(dropZone, { key: 'Enter', code: 'Enter' });

    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it('opens file dialog on Space key on the drop zone', () => {
    render(<UploadZone />);

    const dropZone = screen.getByRole('button', { name: /drop pdf invoice/i });
    const input = screen.getByLabelText(/select pdf invoice file/i);
    const clickSpy = jest.spyOn(input, 'click').mockImplementation(() => {});

    fireEvent.keyDown(dropZone, { key: ' ', code: 'Space' });

    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it('resets to idle when a new valid file is selected after an error', () => {
    render(<UploadZone />);

    const input = screen.getByLabelText(/select pdf invoice file/i);

    fireEvent.change(input, { target: { files: [createMockTextFile()] } });
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(input, { target: { files: [createMockFile()] } });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('invoice.pdf')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /upload & tokenize invoice/i })
    ).toBeEnabled();
  });

  it('shows validation error role="alert" with aria-live="assertive"', () => {
    render(<UploadZone />);

    const file = createMockTextFile();
    const input = screen.getByLabelText(/select pdf invoice file/i);
    fireEvent.change(input, { target: { files: [file] } });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });
});
