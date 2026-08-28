import { describe, expect, it } from "vitest";

import { navItemForPath } from "@/lib/nav-paths";
import { sanitizeInput } from "@/utils/sanitize";
import { getStatusColor } from "@/utils/statusColors";

describe("statusColors", () => {
    it("returns the correct color for SUCCESS", () => {
        expect(getStatusColor("SUCCESS")).toEqual({
            color: "var(--color-success)",
            bg: "var(--color-hex-0a1a10)",
        });
    });

    it("returns the fallback color for unknown status", () => {
        expect(getStatusColor("UNKNOWN_STATUS")).toEqual({
            color: "var(--color-hex-666666)",
            bg: "var(--color-hex-111111)",
        });
    });
});

describe("sanitizeInput", () => {
    it("escapes malicious characters", () => {
        expect(sanitizeInput("<script>alert(1)</script>")).toBe(
            "&lt;script&gt;alert(1)&lt;&#x2F;script&gt;",
        );
    });
});

describe("navItemForPath", () => {
    it("returns correct nav item for paths", () => {
        expect(navItemForPath("/dashboard")).toBe("dashboard");
        expect(navItemForPath("/missions")).toBe("missions");
        expect(navItemForPath("/unknown/path")).toBe("dashboard"); // default fallback
    });
});
