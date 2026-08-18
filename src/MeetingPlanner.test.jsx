import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { copy } from "./clockConfig.js";
import { MeetingPlanner } from "./MeetingPlanner.jsx";
import { worldClocks } from "./clockConfig.js";
import { overlapFor } from "./meetingOverlap.js";

function TestPlanner() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open planner
      </button>
      {isOpen && (
        <MeetingPlanner
          language="en"
          labels={copy.en}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

describe("MeetingPlanner", () => {
  it("focuses, traps focus, and closes with Escape", async () => {
    render(<TestPlanner />);
    const trigger = screen.getByRole("button", { name: "Open planner" });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog", {
      name: "Time zone meeting",
    });
    const closeButton = screen.getByRole("button", { name: "Close planner" });
    const focusable = dialog.querySelectorAll(
      "button:not([disabled]), select:not([disabled]), input:not([disabled])",
    );
    const lastFocusable = focusable[focusable.length - 1];
    await waitFor(() => expect(closeButton).toHaveFocus());
    expect(dialog).toHaveAttribute("aria-modal", "true");

    lastFocusable.focus();
    fireEvent.keyDown(window, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(lastFocusable).toHaveFocus();

    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it("handles a cleared date and calculates quarter-hour time-zone boundaries", () => {
    render(
      <MeetingPlanner language="en" labels={copy.en} onClose={() => {}} />,
    );
    fireEvent.change(screen.getByLabelText("Date / time"), {
      target: { value: "" },
    });
    expect(screen.getAllByText("—")).toHaveLength(3);

    const mumbai = worldClocks.find((city) => city.id === "mumbai");
    const dubai = worldClocks.find((city) => city.id === "dubai");
    expect(
      overlapFor(new Date("2026-08-17T12:00:00"), mumbai, dubai, "en-US"),
    ).toBe("10:30 – 18:00");
  });
});
