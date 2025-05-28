import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Introduction from "./Introduction";

describe("Introduction Component", () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    render(<Introduction />);
  });

  it("renders the Introduction heading", () => {
    expect(screen.getByText("Introduction")).toBeInTheDocument();
  });

  it("renders all section headings", () => {
    // Use queryByRole to specifically target the section headings
    expect(screen.getByRole("heading", { name: "About this application", level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What is a starter kit", level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About using Copilot with VS Code", level: 3 })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "About creating a React application with Copilot", level: 3 })
    ).toBeInTheDocument();
  });

  it("renders the table of contents", () => {
    expect(screen.getByText("Table of Contents")).toBeInTheDocument();
  });

  it("renders links to all sections in the table of contents", () => {
    const links = screen.getAllByRole("link");

    // Filter for TOC links only (they should have href attributes starting with #)
    const tocLinks = links.filter((link) => link.getAttribute("href")?.startsWith("#"));

    expect(tocLinks.length).toBe(4);
    expect(tocLinks[0]).toHaveAttribute("href", "#about-application");
    expect(tocLinks[1]).toHaveAttribute("href", "#starter-kit");
    expect(tocLinks[2]).toHaveAttribute("href", "#copilot-vscode");
    expect(tocLinks[3]).toHaveAttribute("href", "#react-copilot");
  });
});
