/**
 * Created by Neel on 2017/7/3.
 */

const prefixCls = 'ue-resources';

let context = "/";
let unauthorizedUrl = "/";
let resourcesInstance;

const method = {
  'POST': 'POST',
  'GET': 'GET',
  'DELETE': 'DELETE',
  'PUT': 'PUT'
};

function getInstance () {
  resourcesInstance = resourcesInstance || new Resources({

  });

  return resourcesInstance;
}


export default  {
  post (options) {
    const type = typeof options;
    if (type === 'string') {
      options = {
        content: options
      };
    }
    return notice(options.content, options.duration, 'info', options.onClose, options.closable);
  },
  success (options) {
    const type = typeof options;
    if (type === 'string') {
      options = {
        content: options
      };
    }
    return notice(options.content, options.duration, 'success', options.onClose, options.closable);
  },
  warning (options) {
    const type = typeof options;
    if (type === 'string') {
      options = {
        content: options
      };
    }
    return notice(options.content, options.duration, 'warning', options.onClose, options.closable);
  },
  error (options) {
    const type = typeof options;
    if (type === 'string') {
      options = {
        content: options
      };
    }
    return notice(options.content, options.duration, 'error', options.onClose, options.closable);
  },
  loading (options) {
    const type = typeof options;
    if (type === 'string') {
      options = {
        content: options
      };
    }
    return notice(options.content, options.duration, 'loading', options.onClose, options.closable);
  },


  config (options) {
    if (options.context) {
      context = options.context;
    }
    if (options.unauthorizedUrl) {
      unauthorizedUrl = options.unauthorizedUrl;
    }

  }
};
