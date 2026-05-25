import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const createEvent_post = defineEventHandler(async () => {
  return {
    success: false,
    message: "Calendar integration is not implemented yet."
  };
});

export { createEvent_post as default };
//# sourceMappingURL=create-event.post.mjs.map
