const mocha    = require('mocha');
const inherits = require('util').inherits;
const request  = require('sync-request');

function Reporter(runner, opts) {
  const options = opts && opts.reporterOptions || {};

  let pending   = 0;
  let failures  = 0;
  let passes    = 0;


  runner.on('pass', (test) => {
    passes++;
  });

  runner.on('fail', (test) => {
    failures++;
  });

  runner.on('pending', (test) => {
    pending++;
  });

  runner.once('end', () => {
    if (!options.failuresOnly || failures) {
      options.callTo.forEach((to) => {
        const json = {
          from: options.from,
          answer_url : options.answerUrl,
          to
        };
        request('POST', 'https://api.plivo.com/v1/Account/' + options.authId + '/Call/', {
          headers: {
            "Authorization": 'Basic ' + new Buffer(options.authId + ':' + options.authToken).toString('base64'),
            "Content-Type": "application/json"
          },
          json
        });

      });
    }
  });
}

inherits(Reporter, mocha.reporters.Base);

module.exports = Reporter;

