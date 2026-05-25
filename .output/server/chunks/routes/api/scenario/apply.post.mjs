import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const apply_post = defineEventHandler(async () => {
  return {
    success: false,
    message: "Scenario application is not implemented yet."
  };
});

export { apply_post as default };
//# sourceMappingURL=apply.post.mjs.map
