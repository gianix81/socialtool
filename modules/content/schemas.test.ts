import { describe,expect,it } from "vitest";import { draftSchema,workspaceSchema } from "./schemas";
describe("validation",()=>{it("sanitizza il nome del workspace",()=>{expect(workspaceSchema.parse({name:"  Team  "}).name).toBe("Team")});it("richiede testo e piattaforme",()=>{expect(draftSchema.safeParse({workspaceId:crypto.randomUUID(),body:"",platforms:[]}).success).toBe(false)})});

