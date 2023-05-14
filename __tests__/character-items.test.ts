import { getCharacterItems } from "../src";

describe("character items", () => {
  it("should not throw", async () => {
    const items = await getCharacterItems({
      characterId: 467968,
      serverName: "tempest",
    });
    expect(() => items).not.toThrow();
  });
});
