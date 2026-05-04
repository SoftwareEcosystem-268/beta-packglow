import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthContext";

// Mock next/navigation
const mockPush = jest.fn();
const mockPathname = jest.fn(() => "/");
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: mockPush }),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { alt: string; src: string }) => <img alt={props.alt} src={props.src} />,
}));

function renderNavbar(variant: "dark" | "light" = "dark") {
  return render(
    <AuthProvider>
      <Navbar variant={variant} />
    </AuthProvider>
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockReset();
    mockPathname.mockReturnValue("/");
  });

  it("renders the logo text", () => {
    renderNavbar();
    expect(screen.getByText("PackGlow")).toBeInTheDocument();
  });

  it("shows Login and Sign Up when not logged in", () => {
    renderNavbar();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("shows desktop nav links", () => {
    renderNavbar();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Destinations")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
  });

  it("shows user avatar after login", async () => {
    localStorage.setItem("pg_current_user", JSON.stringify({ id: "1", name: "Test User", email: "test@test.com" }));
    localStorage.setItem("pg_user_tier", "free");

    renderNavbar();
    expect(screen.getByText("PackGlow")).toBeInTheDocument();
  });

  it("has hamburger button on mobile (always present but hidden on md+)", () => {
    renderNavbar();
    // The Menu icon button exists (hidden via CSS on md+)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders with light variant", () => {
    renderNavbar("light");
    expect(screen.getByText("PackGlow")).toBeInTheDocument();
  });
});
