import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Sidebar, SidebarGroup, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger } from "./Sidebar";

describe("Sidebar", () => {
  it("renders the sidebar component with children", () => {
    // Arrange
    render(
      <Sidebar data-testid="sidebar">
        <div>Sidebar content</div>
      </Sidebar>
    );

    // Assert
    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveClass("flex h-full flex-col overflow-y-auto");
    expect(sidebar).toHaveTextContent("Sidebar content");
  });

  it("applies custom className to the sidebar", () => {
    // Arrange
    render(
      <Sidebar data-testid="sidebar" className="custom-class">
        <div>Sidebar content</div>
      </Sidebar>
    );

    // Assert
    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toHaveClass("custom-class");
  });
});

describe("SidebarHeader", () => {
  it("renders the sidebar header with children", () => {
    // Arrange
    render(
      <SidebarHeader data-testid="sidebar-header">
        <div>Header content</div>
      </SidebarHeader>
    );

    // Assert
    const header = screen.getByTestId("sidebar-header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("flex h-14 items-center border-b");
    expect(header).toHaveTextContent("Header content");
  });
});

describe("SidebarContent", () => {
  it("renders the sidebar content with children", () => {
    // Arrange
    render(
      <SidebarContent data-testid="sidebar-content">
        <div>Content</div>
      </SidebarContent>
    );

    // Assert
    const content = screen.getByTestId("sidebar-content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("flex-1 overflow-y-auto py-2");
    expect(content).toHaveTextContent("Content");
  });
});

describe("SidebarFooter", () => {
  it("renders the sidebar footer with children", () => {
    // Arrange
    render(
      <SidebarFooter data-testid="sidebar-footer">
        <div>Footer content</div>
      </SidebarFooter>
    );

    // Assert
    const footer = screen.getByTestId("sidebar-footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("flex items-center border-t");
    expect(footer).toHaveTextContent("Footer content");
  });
});

describe("SidebarTrigger", () => {
  it("renders the sidebar trigger with children", () => {
    // Arrange
    render(
      <SidebarTrigger data-testid="sidebar-trigger">
        <span>Trigger</span>
      </SidebarTrigger>
    );

    // Assert
    const trigger = screen.getByTestId("sidebar-trigger");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveClass("inline-flex items-center justify-center rounded-md");
    expect(trigger).toHaveTextContent("Trigger");
  });

  it("calls onClick when clicked", async () => {
    // Arrange
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <SidebarTrigger data-testid="sidebar-trigger" onClick={onClick}>
        <span>Trigger</span>
      </SidebarTrigger>
    );

    // Act
    await user.click(screen.getByTestId("sidebar-trigger"));

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("SidebarGroup", () => {
  it("renders the sidebar group with title and children", () => {
    // Arrange
    render(
      <SidebarGroup data-testid="sidebar-group" title="Group Title">
        <div>Group content</div>
      </SidebarGroup>
    );

    // Assert
    const group = screen.getByTestId("sidebar-group");
    expect(group).toBeInTheDocument();
    expect(screen.getByText("Group Title")).toBeInTheDocument();
    // Group content is not visible by default as the group is closed
    expect(screen.queryByText("Group content")).not.toBeInTheDocument();
  });

  it("opens the group when defaultOpen is true", () => {
    // Arrange
    render(
      <SidebarGroup data-testid="sidebar-group" title="Group Title" defaultOpen={true}>
        <div>Group content</div>
      </SidebarGroup>
    );

    // Assert
    expect(screen.getByText("Group content")).toBeInTheDocument();
  });

  it("toggles the group when clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <SidebarGroup data-testid="sidebar-group" title="Group Title">
        <div>Group content</div>
      </SidebarGroup>
    );

    // Assert - initially closed
    expect(screen.queryByText("Group content")).not.toBeInTheDocument();

    // Act - open the group
    await user.click(screen.getByText("Group Title"));

    // Assert - now open
    expect(screen.getByText("Group content")).toBeInTheDocument();

    // Act - close the group
    await user.click(screen.getByText("Group Title"));

    // Assert - closed again
    expect(screen.queryByText("Group content")).not.toBeInTheDocument();
  });
});
