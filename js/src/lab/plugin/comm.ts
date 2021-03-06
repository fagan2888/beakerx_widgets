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

import { DocumentRegistry } from '@jupyterlab/docregistry';
import { Notebook, NotebookPanel } from '@jupyterlab/notebook';
import { showDialog, Dialog, IClientSession } from '@jupyterlab/apputils';
import { sendJupyterCodeCells, getCodeCellsByTag } from './codeCells';
import { Kernel } from '@jupyterlab/services';
import { CodeCell } from '@jupyterlab/cells';
import { messageData, messageState } from '../interface/messageData';
import { AutoTranslation } from './autoTranslation';

export const BEAKER_GETCODECELLS = 'beakerx.getcodecells';
export const BEAKER_AUTOTRANSLATION = 'beakerx.autotranslation';
export const BEAKER_TAG_RUN = 'beakerx.tag.run';

const getMsgHandlers = (session: IClientSession, kernelInstance: Kernel.IKernelConnection, notebook: Notebook) => ({
  [BEAKER_GETCODECELLS]: (msg) => {
    const state: messageState = msg.content.data.state;

    if (!state.name) {
      return;
    }

    if (state.name == 'CodeCells') {
      sendJupyterCodeCells(notebook, JSON.parse(state.value), msg.content.data.url);
    }

    window.beakerx[state.name] = JSON.parse(state.value);
  },

  [BEAKER_AUTOTRANSLATION]: (msg) => {
    const state: messageState = msg.content.data.state;

    window.beakerx[AutoTranslation.LOCK_PROXY] = true;
    window.beakerx[state.name] = JSON.parse(state.value);
    window.beakerx[AutoTranslation.LOCK_PROXY] = false;
  },

  [BEAKER_TAG_RUN]: (msg) => {
    const data: messageData = msg.content.data;

    if (!data.state || !data.state.runByTag) {
      return;
    }

    const matchedCells = getCodeCellsByTag(notebook, data.state.runByTag);

    if (matchedCells.length === 0) {
      showDialog({
        title: 'No cell with the tag !',
        body: 'Tag: ' + data.state.runByTag,
        buttons: [Dialog.okButton({ label: 'OK' })],
      });
    } else {
      matchedCells.forEach((cell) => {
        cell instanceof CodeCell && CodeCell.execute(cell, session);
      });
    }
  },
});

export const registerCommTargets = async (
  panel: NotebookPanel,
  context: DocumentRegistry.IContext<DocumentRegistry.IModel>,
): Promise<void> => {
  const session = context.session;
  const kernelInstance = session.kernel;
  const notebook = panel.content;
  const msgHandlers = getMsgHandlers(session, kernelInstance, notebook);

  kernelInstance.registerCommTarget(BEAKER_GETCODECELLS, (comm) => {
    comm.onMsg = msgHandlers[BEAKER_GETCODECELLS];
  });

  kernelInstance.registerCommTarget(BEAKER_AUTOTRANSLATION, (comm) => {
    comm.onMsg = msgHandlers[BEAKER_AUTOTRANSLATION];
  });

  kernelInstance.registerCommTarget(BEAKER_TAG_RUN, (comm) => {
    comm.onMsg = msgHandlers[BEAKER_TAG_RUN];
  });

  const msg = await kernelInstance.requestCommInfo({});
  if (msg.content.status === 'ok') {
    assignMsgHandlersToExistingComms(msg.content.comms, kernelInstance, msgHandlers);
  }
};

const assignMsgHandlersToExistingComms = (
  comms: Record<string, any>,
  kernelInstance: Kernel.IKernelConnection,
  msgHandlers: Record<string, any>,
): void => {
  let comm;
  for (const commId in comms) {
    comm = kernelInstance.connectToComm(comms[commId].target_name, commId);
    assignMsgHandlerToComm(comm, msgHandlers[comm.targetName]);
  }
};

const assignMsgHandlerToComm = (comm, handler): void => {
  if (handler) {
    comm.onMsg = handler;
  }
};
