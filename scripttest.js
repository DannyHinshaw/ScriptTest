// ==UserScript==
// @name         ScriptTest - Atom Copy
// @version      1.3
// @description  Javascript Performance Tests
// @author       DjBonadoobie
// @match        https://www.google.com/scripttest
// @match        https://www.google.com/
// ==/UserScript==

(function() {
	'use strict';
	/*jshint esnext: true */

	// JS Test UI Object
	const TEST_UI = {
		runFlag  : true,
		errorFlag: false,
		templates: {
			favicon   : function() {
				const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
				link.type  = 'image/x-icon';
				link.rel   = 'shortcut icon';
				link.href  = 'http://nulleffort.com/wp-content/uploads/2016/11/cropped-favicon-32x32.png';
				document.getElementsByTagName('head')[0].appendChild(link);
			},
			body      : `
				<header>
					<h1>ScriptTest</h1>
					<p>We're going the distance... we're going for speed.</p>
				</header>
				<main>
				  <div id="intro">
					  <div id="instructions">
				        <h2>USE:</h2>
				        <p>
				          To use ScriptTest, enter any html you may need for your test scripts in the html box (not required). Do not worry about headers etc, the html is already set up, you are essentially just entering elements into a body.
				        </p>
				        <p>
				          Add as many test boxes as the Javascript snippets you'd like to test. Each editor will be treated as a separate test case. You do not need to add any loops as ScriptTest will take care of that for you (just select from the settings how many iterations you want for testing).
				        </p>
					</div>
			        <div id="settings">
			          <h3>Settings</h3>
					  <div class="setting_cont">
				          <span> Iterations:</span>
				          <select id="iterations">
				            <option value="101">100</option>
				            <option value="1001">1,000</option>
				            <option value="10001">10,000</option>
				            <option value="100001">100,000</option>
				          </select>
					  </div>
					  <div class="setting_cont">
				          <span>Click to add more tests:</span>
				          <button id="add_btn">Add Test</button>
					  </div>
					  <div class="setting_cont">
				          <span>Click to remove all tests:</span>
				          <button id="remove_all_btn">Remove Tests</button>
					  </div>
					  <br>
				      </div>
				  </div>
				  <div id="html_div">
					  <div class="html_editor">
					  	<br>
					    <label for="html">HTML</label>
					    <textarea id="html" placeholder="Enter HTML" cols="70" rows="15"></textarea>
						</div>
				  </div>
				  <div id="test_1_div" class="js_div">
					  <div class="js_editor">
					  	<br>
					    <label for="test_1">Javascript Test 1</label>
					    <textarea id="test_1" placeholder="Enter Javascript" cols="70" rows="15"></textarea>
					  </div>
				  </div>
				  <div id="test_commands">
				  <br>
				    <span>Click to run tests</span>
				    <button id="start_btn">Run</button>
				  </div>

				  <div id="loader_container">
				  	<div id="block_0" class="barlittle"></div>
					<div id="block_1" class="barlittle"></div>
					<div id="block_2" class="barlittle"></div>
					<div id="block_3" class="barlittle"></div>
					<div id="block_4" class="barlittle"></div>
					<div id="block_5" class="barlittle"></div>
					<div id="block_6" class="barlittle"></div>
					<div id="block_7" class="barlittle"></div>
					<div id="block_8" class="barlittle"></div>
					<div id="block_9" class="barlittle"></div>
					<div id="block_10" class="barlittle"></div>
				  </div>

				  <div id="res-text-cont">
				  	<p id="results_label">Results</p>
				  	<p id="results_instruct">*The first test is used as a base to compare the rest.</p>
				  </div>
				  <div id="results_table">
				  	<div class="results_body">
				  	</div>
				  </div>
				</main>
				<footer>
				  <span>This script is currently in beta. There are no gaurantees it will work with your browser... or work at all.</span>
				</footer>`,
			css       : `
				<style>`+

				/***** Main CSS Styles ****/

				   `body { color: white }
					header { align: left; background-color: #161F2F; box-shadow: 0px 2px 5px #201717; margin: -10px -10px 1px; padding: 25px; }
					header > h1 { font-family: Rockwell; font-size: 3em; margin-left: 25px;	}
					header > h1::first-letter { font-size: 2em; }
					header > p { font-family: Andale Mono, monospace; font-style: italic; margin-left: 25px; }
					body { background-color: #3c434f}
					main { padding: 25px; font-family: Verdana; letter-spacing: .05em; }
					#instructions { border-bottom: ridge; }
					#instructions > *, #settings > * , #test_commands, #res-text-cont { margin-left: 1.5em; }
					#html_div > *, div.js_div > * { margin-left: 3em }
					p { color: #E7DFDD }
					#settings { display: inline-block; padding-bottom: 1.75em; }
					#html_div { border-top: ridge; }
					div.setting_cont { float: left; padding: .01em; width: auto; }
					label, textarea { display:block; margin:10px 0; }
					textarea { background-color: #FAEBD7; font-family: monospace; font-size: 15px; }
					.js_div { border-top: ridge }
					footer > span { font-family: Andale Mono, monospace; font-style: italic; }
					iframe { display: none }
					#errDIV { background-color: #800000; border-style: inset; margin-top: 15px; padding: 1px 10px 10px; }
					#res-text-cont { display: none; }
					#results_label { font-size: 1.5em; }
					#results_table { display: table; visibility: hidden; width: 100%; }
					.results_row { display: table-row }
					.test_rank > span::after { content: attr(data-rel); margin-left: 5px; }
					.cell { background-color: #161F2F; border: 1px solid #999999; display: table-cell; padding: 3px 10px; }
					.results_body { display: table-row-group }`+

				/**** Loader CSS ***/
				  `#loader_container {
					  display: none;
					  margin: 2.5em auto 5em 12em;
					  width: 100%;
				  }
				   .barlittle {
				       background-color: #0eaa1a;
				       background-image: -webkit-linear-gradient(45deg, #0eaa1a 25%, #067f0f);
				       border-left: 1.5px solid #111;
				       border-top: 1.5px solid #111;
				       border-right: 1.5px solid #333;
				       border-bottom: 1.5px solid #333;
				       width: 14px;
				       height: 14px;
				       float: left;
				       margin-left: 7px;
				       opacity: 0.1;
				       -webkit-transform: scale(0.7);
				       -webkit-animation: move 1s infinite linear;
				   }
				   #block_0 { -webkit-animation-delay: .7s; }
				   #block_1 { -webkit-animation-delay: .6s; }
				   #block_2 { -webkit-animation-delay: .5s; }
				   #block_3 { -webkit-animation-delay: .4s; }
				   #block_4 { -webkit-animation-delay: .3s; }
				   #block_5 { -webkit-animation-delay: .2s; }
				   #block_6 { -webkit-animation-delay: .3s; }
				   #block_7 { -webkit-animation-delay: .4s; }
				   #block_8 { -webkit-animation-delay: .5s; }
				   #block_9 { -webkit-animation-delay: .6s; }
				   #block_10 { -webkit-animation-delay: .7s; }
				   @-webkit-keyframes move {
				       0% { -webkit-transform: scale(1.2); opacity: 1; }
				       100% { -webkit-transform: scale(0.7); opacity: 0.1; }
				   }
				</style>`,
			mainScript: `
				<html lang="en">
					<head>
					<script>
						window.addEventListener('load', () => {
							window.parent.dispatchEvent(new Event('perf:load'));
						});
					</script>
					<script id="_script_">` +
					/************************ Iframe Performance Function ******************************/
						`window.addEventListener('perf:exec', e => {
							const {fn} = e.detail;
							let t0, t1;

							try {
								const script = new Function(fn);
								document.body.innerHTML = window.parent.document.body.querySelector('iframe').dataset.body;
								t0 = performance.now();
								script();
								t1 = performance.now();
							} catch(err) {
								const event = new CustomEvent('perf:error', {detail: {error: err}});
								window.parent.dispatchEvent(event);
								return console.error(err);
							}
							const event = new CustomEvent('perf:done', {detail: {time: t1-t0}});
							e.ownerObject.dispatch(event);
						});`+
					'</script> </head> <body></body> </html>',
			id        : () => {
				return document.querySelectorAll('textarea').length;
			},
			editor    : function() {
				// Editor template
				let editor       = document.createElement('div');
				editor.id        = 'test_' + TEST_UI.templates.id() + '_div';
				editor.className = "js_div";
				editor.innerHTML = `
				<div class="js_editor">
				<label for="test_${TEST_UI.templates.id()}">Javascript Test ${TEST_UI.templates.id()}</label>
				<button class="remove_btn">Remove Test ${TEST_UI.templates.id()}</button>
				<textarea id="test_${TEST_UI.templates.id()}" class="js_editor" placeholder="Enter Javascript" cols="70" rows="15"></textarea>
				</div>`;

				// Dynamic Editor Removal
				document.getElementsByTagName('main')[0].insertBefore(editor, document.getElementById('test_commands'));
				[].forEach.call(document.querySelectorAll('button.remove_btn'), b => b.onclick = () => {
					b.parentNode.parentNode.remove();
					rename();
				});

				function rename() {
					let i = 1;
					[].forEach.call(document.querySelectorAll('div.js_div ~ div.js_div'), e => {
						i++;
						e.querySelector('button.remove_btn').textContent = 'Remove Test '+i;
						e.querySelector('div>label').textContent         = 'Javascript Test '+i;
						e.querySelector('div>textarea').id               = 'test_'+i;
						e.id                                             = 'test_'+i+'_div';
					});
				}
			},
		},

		iframe   : {
			create: function(html) {
				const iframe        = document.createElement('iframe');
				iframe.id           = '__iframe';
				iframe.srcdoc       = TEST_UI.templates.mainScript;
				iframe.dataset.body = html;

				document.body.append(iframe);
				TEST_UI.frameDOM = { iframe: iframe, dom: iframe.contentDocument, window: iframe.contentWindow };
				return TEST_UI.frameDOM;
			},
		},
		perfFunc : function() {

			console.log('Testing in progress...');

			TEST_UI.runFlag    = false;
			TEST_UI.iterations = Number(document.querySelector('#iterations').value);
			const textarea     = document.querySelectorAll('textarea:not(#html)'),
				  resultTable  = document.getElementById('results_label'),
				  resultBody   = document.querySelector('.results_body');

			function genTable(num, id, mean) {

				document.getElementById('loader_container').style.display = 'none';
				document.getElementById('res-text-cont').style.display    = 'block';

				// Check if table has yet been displayed
				if (resultTable.offsetParent === null && !TEST_UI.errorFlag) resultTable.style.display = 'block';

				resultBody.innerHTML += `
				  <div class="results_row">
				  	<div class="cell"><p class="test_number">${id.replace('test_', 'Test ')}</p></div>
					<div class="cell"><p class="test_time">${Math.round(mean*1000000)/1000000 + ' milliseconds'}</p></div>
					<div class="cell"><p class="test_rank"><span></span></p></div>
				  </div>`;

			  	const tableTimes = Array.from(resultBody.querySelectorAll('.test_time'));

				if (tableTimes.length === textarea.length) {
					const ranks = resultBody.querySelectorAll('.test_rank>span');
					tableTimes.map(({ textContent:ms }) => ms.split(' ')[0])
					.map((time, _, a) => 100 * (a[0] / time - 1))
					.forEach((v, i) => {
						ranks[i].dataset.rel = v ? (v > 0 ? 'faster' : 'slower') : '';
						ranks[i].textContent = Math.abs(v || 100).toFixed(2) + '%';
					});
				}
			}

			function end(num, id, times) {
				times.shift();
				const mean = times.reduce((a, b) => a + b) / TEST_UI.iterations;
				genTable(num, id, mean);
			}

			for (let i = 0; i < textarea.length; i++) {

				const val = textarea[i].value;

				// Handling for UI errors (empty textareas)
				if (!val) {
					TEST_UI.onError(textarea[i]);
					return console.log('Script in', textarea[i].id, 'has no value');
				} else if (document.getElementById('errDIV')) {
					TEST_UI.errorFlag = false;
					document.getElementById('errDIV').remove();
					[].forEach.call(document.querySelectorAll('textarea:not(#html)'), t => {
						if (t.style.backgroundColor === 'red')
							t.style.backgroundColor = "#FAEBD7";
					});
				}

				TEST_UI.runners = [];
				let j           = TEST_UI.iterations;

				while (j--) {
					if (TEST_UI.runFlag === false) {
						const promise = new Promise(resolve => {
							const pf = new PerfRunner(TEST_UI.frameDOM);
							pf.listen('perf:done', e => resolve(e.detail.time));
							pf.run(val);
						});
						TEST_UI.runners.push(promise);
					}
				}
				Promise.all(TEST_UI.runners).then(end.bind(null, i, textarea[i].id));
			}//);
			TEST_UI.runFlag = true;
			document.getElementById('__iframe').remove();
			TEST_UI.templates.favicon();
		},
		onError  : function(err) {

			document.getElementById('res-text-cont').style.display     = 'block';
			document.getElementById('loader_container').style.display  = 'none';

			if (document.getElementById('results_label').offsetParent !== null)
				document.getElementById('results_label').style.display = 'none';

			if (document.getElementById('errDIV'))
				document.getElementById('errDIV').remove();

			const errDiv      = document.createElement('div');
			errDiv.id         = 'errDIV';
			TEST_UI.errorFlag = true;
			TEST_UI.runFlag   = true;
			document.getElementById('results_label').parentNode.append(errDiv);

			if (err.detail) {
				errDiv.innerHTML = `<h2>Error:</h2><p>${err.detail.error.stack}</p>`;
			} else {
				errDiv.innerHTML          = '<h2>Error: One or more JS editors is empty</h2>';
				err.style.backgroundColor = 'red';
			}

		},
		commands : {
			loading   : function() {
				[].forEach.call(document.querySelectorAll('div.results_row'), r => r.remove());

				document.getElementById('res-text-cont').style.display     = 'none';
				document.getElementById('loader_container').style.display  = 'block';
			},
			removeAll : function() {
				[].forEach.call(document.querySelectorAll('div.js_div ~ div.js_div'), e => e.remove());
				document.getElementById('test_1').value = "";
			},
			removeTest: function(b) {
				b.parentNode.remove();
			},
			run       : function() {
				if (TEST_UI.runFlag) {
					TEST_UI.commands.loading();
					TEST_UI.iframe.create(document.querySelector('#html').value);
					document.getElementById('results_table').style.visibility = 'visible';
					TEST_UI.runFlag                                           = true;
				}
			},
		},
		init    : function() {

			console.log('ScriptTest started');

			// Set favicon
			TEST_UI.templates.favicon();

			// Custom window event listener
			document.getElementsByTagName('style')[0].remove();

			window.addEventListener('perf:load', TEST_UI.perfFunc);
			window.addEventListener('perf:error', TEST_UI.onError);

			// Setup UI
			document.head.innerHTML = TEST_UI.templates.css;
			document.body.innerHTML = TEST_UI.templates.body;
			document.title          = 'ScriptTest';

			// Set button actions
			document.getElementById('add_btn').onclick        = () => TEST_UI.templates.editor();
			document.getElementById('remove_all_btn').onclick = () => TEST_UI.commands.removeAll();
			document.getElementById('start_btn').onclick      = () => TEST_UI.commands.run();
		}
	};

	//Class to handle async promises in perfFunc
	class PerfRunner {
		constructor(iframe) {
			this.iframe    = iframe;
			this.listeners = {};
		}

		run(fn) {
			const event       = new CustomEvent('perf:exec', { detail: { fn: fn } });
			event.ownerObject = this;
			this.iframe.window.dispatchEvent(event);
		}

		listen(type, callback) {
			if (!this.listeners[type])
			this.listeners[type] = [];
			this.listeners[type].push(callback);
		}

		dispatch(event) {
			if (!this.listeners[event.type]) return;
			this.listeners[event.type].forEach(fn => fn.call(this, event));
		}
	}

	// Initialize
	if (!window.location.href.includes('scripttest')) {
		// Add link for ScriptTest to google.com
		const parentDiv = document.querySelector('div.gb_zf.gb_R.gb_Pf.gb_Hf'),
			  firstBtn  = document.querySelectorAll('div.gb_Q.gb_R')[1],
			  startBtn  = document.createElement('div');

		startBtn.className = 'gb_Q gb_R';
		startBtn.innerHTML = '<a class="gb_P" href="https://www.google.com/scripttest">ScriptTest</a>';
		parentDiv.insertBefore(startBtn, firstBtn);
	} else {
		// Load UI
		TEST_UI.init();
	}

})();
