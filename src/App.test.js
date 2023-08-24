import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders the app header', () => {
    const { getByText } = render(<App />);
    const headerElement = getByText('Get Github Repos');
    expect(headerElement).toBeInTheDocument();
  });

  test('displays a loading spinner while fetching data', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const { getByLabelText, getByText, findByText } = render(<App />);

    const submitButton = getByText('Go');
    fireEvent.click(submitButton);

    await act(async () => {
      const loadingSpinner = await findByText('Get Github Repos');
      expect(loadingSpinner).toBeInTheDocument();
    });
  });

  test('displays "No repos" message when no repositories are found', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const { getByText, findByText } = render(<App />);

    const submitButton = getByText('Go');
    fireEvent.click(submitButton);

    await act(async () => {
      const noReposMessage = await findByText('No repos');
      expect(noReposMessage).toBeInTheDocument();
    });
  });

  test('displays repositories when fetched successfully', async () => {
    const mockedRepos = [
      { id: 1, name: 'repo1', description: 'Description 1', html_url: 'https://repo1-url' },
      { id: 2, name: 'repo2', description: 'Description 2', html_url: 'https://repo2-url' },
    ];

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockedRepos),
    });

    const { getByText, findByText } = render(<App />);

    const submitButton = getByText('Go');
    fireEvent.click(submitButton);

    await act(async () => {
      for (const repo of mockedRepos) {
        const repoLink = await findByText(repo.name);
        expect(repoLink).toBeInTheDocument();
        expect(repoLink).toHaveAttribute('href', repo.html_url);
      }

      const repoAmount = await findByText('Found 2 Repos');
      expect(repoAmount).toBeInTheDocument();
    });
  });

  test('displays error message for invalid user', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
    });

    const { getByText, findByText } = render(<App />);

    const submitButton = getByText('Go');
    fireEvent.click(submitButton);

    await act(async () => {
      const errorMessage = await findByText('Github user not found');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
