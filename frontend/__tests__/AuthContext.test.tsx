import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "@/components/AuthContext";

function TestComponent() {
  const { user, login, signup, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : "no-user"}</span>
      <button onClick={() => login("test@example.com", "password123")}>login</button>
      <button onClick={() => signup("Test", "test@example.com", "password123")}>signup</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

const mockFetch = jest.fn();
global.fetch = mockFetch;

function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("throws if useAuth used outside provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow("useAuth must be used within an AuthProvider");
    spy.mockRestore();
  });

  it("logs in successfully and stores token", async () => {
    localStorage.clear();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "fake-token",
        user: { id: "1", name: "Test", email: "test@example.com" },
      }),
    });

    renderWithAuth();
    await userEvent.click(screen.getByText("login"));

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/login"),
      expect.objectContaining({ method: "POST" })
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("test@example.com");
    });
    expect(localStorage.getItem("pg_access_token")).toBe("fake-token");
  });

  it("returns error on failed login but does not clear existing user", async () => {
    localStorage.clear();
    // Login successfully first
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "token1",
        user: { id: "1", name: "Test", email: "user1@example.com" },
      }),
    });

    renderWithAuth();
    await userEvent.click(screen.getByText("login"));

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("user1@example.com");
    });

    // Failed login attempt — user stays logged in as user1
    mockFetch.mockResolvedValueOnce({ status: 401, ok: false });
    await userEvent.click(screen.getByText("login"));

    // The existing user is preserved (AuthContext doesn't clear on failed attempt)
    expect(screen.getByTestId("user")).toHaveTextContent("user1@example.com");
  });

  it("signs up successfully and stores user", async () => {
    localStorage.clear();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        access_token: "signup-token",
        user: { id: "2", name: "New", email: "new@example.com" },
      }),
    });

    renderWithAuth();
    await userEvent.click(screen.getByText("signup"));

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/"),
      expect.objectContaining({ method: "POST" })
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("new@example.com");
    });
    expect(localStorage.getItem("pg_access_token")).toBe("signup-token");
  });

  it("returns error on duplicate email signup but keeps existing user", async () => {
    localStorage.clear();
    // Login first
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "token",
        user: { id: "1", name: "Test", email: "existing@example.com" },
      }),
    });

    renderWithAuth();
    await userEvent.click(screen.getByText("login"));

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("existing@example.com");
    });

    // Duplicate email signup attempt
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: "Email already registered" }),
    });
    await userEvent.click(screen.getByText("signup"));

    // Existing user preserved
    expect(screen.getByTestId("user")).toHaveTextContent("existing@example.com");
  });

  it("logs out and clears storage", async () => {
    localStorage.clear();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "token",
        user: { id: "1", name: "Test", email: "test@example.com" },
      }),
    });

    renderWithAuth();
    await userEvent.click(screen.getByText("login"));

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("test@example.com");
    });

    await userEvent.click(screen.getByText("logout"));

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("no-user");
    });
    expect(localStorage.getItem("pg_access_token")).toBeNull();
    expect(localStorage.getItem("pg_current_user")).toBeNull();
  });
});
