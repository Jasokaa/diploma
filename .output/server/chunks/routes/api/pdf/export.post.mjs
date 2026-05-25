import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const export_post = defineEventHandler(async () => {
  return {
    success: false,
    message: "PDF export is not implemented yet."
  };
});

export { export_post as default };
//# sourceMappingURL=export.post.mjs.map
