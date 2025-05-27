import { describe, it, expect } from "vitest";
import { cn } from "./css";

describe("CSS Utilities", () => {
  describe("cn function", () => {
    it("should combine class names properly", () => {
      // Arrange
      const classes1 = "text-red-500";
      const classes2 = "bg-blue-300";

      // Act
      const result = cn(classes1, classes2);

      // Assert
      expect(result).toBe("text-red-500 bg-blue-300");
    });

    it("should handle conditional classes", () => {
      // Arrange
      const isActive = true;

      // Act
      const result = cn("base-class", isActive && "active-class");

      // Assert
      expect(result).toBe("base-class active-class");
    });

    it("should handle Tailwind conflicts by using the last defined class", () => {
      // Arrange
      const baseClasses = "p-4 text-sm";
      const overrideClasses = "p-6 text-lg";

      // Act
      const result = cn(baseClasses, overrideClasses);

      // Assert
      expect(result).toBe("p-6 text-lg");
    });

    it("should handle undefined or false values", () => {
      // Arrange
      const baseClass = "base-class";
      const isActive = false;
      const conditionalClass = isActive ? "should-not-appear" : "";
      const undefinedClass = undefined;

      // Act
      const result = cn(baseClass, conditionalClass, undefinedClass);

      // Assert
      expect(result).toBe("base-class");
    });

    it("should handle array of class names", () => {
      // Arrange
      const classes = ["text-red-500", "bg-blue-300", "p-4"];

      // Act
      const result = cn(classes);

      // Assert
      expect(result).toBe("text-red-500 bg-blue-300 p-4");
    });
  });
});
