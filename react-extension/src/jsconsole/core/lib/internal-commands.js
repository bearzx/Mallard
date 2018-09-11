/*global window EventSource fetch */
import { getContainer } from './run';

const version = process.env.REACT_APP_VERSION;
const API = process.env.REACT_APP_API || '';

// Missing support
// :load <url> - to inject new DOM

const welcome = () => ({
  value: `Use <strong>:help</strong> to show jsconsole commands
version: ${version}`,
  html: true,
});

const help = () => ({
  value: `:listen [id] - starts remote debugging session
:theme dark|light
:load &lt;script_url&gt; load also supports shortcuts, like \`:load jquery\`
:libraries
:clear
:history
:about
:version
copy(<value>) and $_ for last value

${about().value}`,
  html: true,
});

const about = () => ({
  value:
    'Built by <a href="https://twitter.com/rem" target="_blank">@rem</a> • <a href="https://github.com/remy/jsconsole" target="_blank">open source</a> • <a href="https://www.paypal.me/rem/9.99usd" target="_blank">donate</a>',
  html: true,
});

const libs = {
  tensorflow: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.12.0',
  vega3: 'https://cdnjs.cloudflare.com/ajax/libs/vega/3.3.1/vega.js',
  vega4: 'https://cdnjs.cloudflare.com/ajax/libs/vega/4.2.0/vega.js',
  'vega-lite': 'https://cdnjs.cloudflare.com/ajax/libs/vega-lite/2.6.0/vega-lite.js',
  'vega-embed': 'https://cdn.jsdelivr.net/npm/vega-embed@3',
  jquery: 'https://code.jquery.com/jquery.min.js',
  underscore: 'https://cdn.jsdelivr.net/underscorejs/latest/underscore-min.js',
  lodash: 'https://cdn.jsdelivr.net/lodash/latest/lodash.min.js',
  moment: 'https://cdn.jsdelivr.net/momentjs/latest/moment.min.js',
  datefns: 'https://cdn.jsdelivr.net/gh/date-fns/date-fns/dist/date_fns.min.js',
};

const _load = async ({ args: urls, console }) => {
  // const document = getContainer().contentDocument;
  urls.forEach(url => {
    url = libs[url] || url;
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => console.log(`Loaded ${url}`);
    script.onerror = () => console.warn(`Failed to load ${url}`);
    document.body.appendChild(script);
  });
  return 'Loading script…';
};

const load = async ({ args: url }) => {
  await remoteLoad({ args: url });
}

const seqLoad = async ({ args: urls, console }) => {
  for (const url of urls) {
    await remoteLoad({ args: url });
  }
};

const remoteLoad = async ({ args: url }) => {
    return new Promise((resolve, reject) => {
      url = libs[url] || url;
      console.log(`loading ${url}`);
      fetch(url).then((res) => {
          res.text().then((code) => {
              eval.call(window, code);
              console.log(`${url} loaded`);
              resolve();
          });
      });
    })
}

const yo = () => { console.log('yo'); }

const libraries = () => {
  return {
    value: Object.keys(libs)
      .map(name => `<strong>${name}</strong>: ${libs[name]}`)
      .join('\n'),
    html: true,
  };
};

const set = async ({ args: [key, value], app }) => {
  switch (key) {
    case 'theme':
      if (['light', 'dark'].includes(value)) {
        app.props.setTheme(value);
      }
      break;
    case 'layout':
      if (['top', 'bottom'].includes(value)) {
        app.props.setLayout(value);
      }
      break;
    default:
  }
};

const theme = async ({ args: [theme], app }) => {
  if (['light', 'dark'].includes(theme)) {
    app.props.setTheme(theme);
    return;
  }

  return 'Try ":theme dark" or ":theme light"';
};

const history = async ({ app, args: [n = null] }) => {
  const history = app.context.store.getState().history;
  if (n === null) {
    return history.map((item, i) => `${i}: ${item.trim()}`).join('\n');
  }

  // try to re-issue the historical command
  const command = history.find((item, i) => i === n);
  if (command) {
    app.onRun(command);
  }

  return;
};

const clear = ({ console }) => {
  console.log('console clear');
  console.clear();
};

const edit = async ({ args: [name], console }) => {
  console._edit_(name);
};

const showCode = async () => {
  window.show_code();
};

const run = async ({ args: [name], console }) => {
  console._run_(name);
  return `${name} evaled`; // [Xiong] more indicators?
};

const seqrun = async ({ args: names, console }) => {
  for (const name of names) {
    await run(name);
  }
};

const vis = async ({ args: id, console }) => {
  console.vis(id);
};

const canvas = async ({ args: id, console }) => {
  console.canvas(id);
};

const listen = async ({ args: [id], console: internalConsole }) => {
  // create new eventsocket
  const res = await fetch(`${API}/remote/${id || ''}`);
  id = await res.json();

  return new Promise(resolve => {
    const sse = new EventSource(`${API}/remote/${id}/log`);
    sse.onopen = () => {
      resolve(
        `Connected to "${id}"\n\n<script src="${
          window.location.origin
        }/js/remote.js?${id}"></script>`
      );
    };

    sse.onmessage = event => {
      console.log(event);
      const data = JSON.parse(event.data);
      if (data.response) {
        if (typeof data.response === 'string') {
          internalConsole.log(data.response);
          return;
        }

        const res = data.response.map(_ => {
          if (_.startsWith('Error:')) {
            return new Error(_.split('Error: ', 2).pop());
          }

          if (_ === 'undefined') {
            // yes, the string
            return undefined;
          }

          return JSON.parse(_);
        });
        internalConsole.log(...res);
      }
    };

    sse.onclose = function() {
      internalConsole.log('Remote connection closed');
    };
  });
};

const commands = {
  libraries,
  help,
  about,
  load,
  listen,
  theme,
  clear,
  history,
  set,
  welcome,
  yo,
  remoteLoad,
  seqLoad,
  edit,
  showCode,
  run,
  seqrun,
  vis,
  canvas,
  version: () => version,
};

export default commands;
