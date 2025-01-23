import React from "react";
import { render, screen } from "@testing-library/react";
import AddButton from "./AddButton";
import { describe, it, expect } from "vitest";

describe("AddButton Component", () => {
  it("renders the Add button", () => {
    render(<AddButton onClick={() => {}} />);

    const button = screen.getByText("Add");
    expect(button).not.toBeNull();
    expect(button instanceof HTMLElement).toBe(true);
    expect(button.tagName).toBe("BUTTON");
  });
});
