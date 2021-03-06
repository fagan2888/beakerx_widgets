/*
 *  Copyright 2017 TWO SIGMA OPEN SOURCE, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import './public-path';
import 'flatpickr/dist/flatpickr.css';
import 'jquery-ui/themes/base/all.css';
import 'jquery-ui.combobox/lib/jquery-ui.combobox.css';
import '@phosphor/widgets/style/index.css';
import './../css/beakerx_widgets.css';
/* eslint-disable @typescript-eslint/no-explicit-any */
if ((window as any).require) {
  (window as any).require.config({
    map: {
      '*': {
        beakerx: 'nbextensions/beakerx/index',
        'jupyter-js-widgets': 'nbextensions/jupyter-js-widgets/extension',
        '@jupyter-widgets/base': 'nbextensions/jupyter-js-widgets/extension',
        '@jupyter-widgets/controls': 'nbextensions/jupyter-js-widgets/extension',
      },
    },
  });
}

export { load_ipython_extension } from './extension/index';
