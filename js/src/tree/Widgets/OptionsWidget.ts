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

import $ from 'jquery';
import { TabPanel } from '@phosphor/widgets';
import { Message, MessageLoop } from '@phosphor/messaging';

import { UIOptionsWidget } from './UIOptions';
import { JVMOptionsModel, UIOptionsModel } from '../Models';
import { JVMOptionsWidget } from './JVMOptionsWidget';
import { DOMUtils } from '../Utils';
import { TYPE_JVM_OPTIONS_CHANGED, TYPE_JVM_OPTIONS_ERROR, TYPE_UI_OPTIONS_CHANGED } from '../Messages';

export class OptionsWidget extends TabPanel {
  private _models: {
    jvm: JVMOptionsModel;
    ui: UIOptionsModel;
  } = {
    jvm: null,
    ui: null,
  };

  constructor(isLab: boolean) {
    super();

    this.addClass('bx-options-widget');

    const jvmOptionsWidget = new JVMOptionsWidget();
    this._models.jvm = jvmOptionsWidget.model;
    this.addWidget(jvmOptionsWidget);

    const uiOptionsWidget = new UIOptionsWidget(isLab);
    this._models.ui = new UIOptionsModel(uiOptionsWidget);
    this.addWidget(uiOptionsWidget);
  }

  public get jvmOptionsModel(): JVMOptionsModel {
    return this._models.jvm;
  }

  public get uiOptionsModel(): UIOptionsModel {
    return this._models.ui;
  }

  public processMessage(msg: Message): void {
    switch (msg.type) {
      case TYPE_JVM_OPTIONS_CHANGED:
      case TYPE_JVM_OPTIONS_ERROR:
      case TYPE_UI_OPTIONS_CHANGED:
        MessageLoop.sendMessage(this.parent, msg);
        break;
      default:
        super.processMessage(msg);
        break;
    }
  }

  public updateDimensions() {
    let h = 0;
    h += DOMUtils.getRealElementHeight(this.stackedPanel.node);
    h += DOMUtils.getRealElementHeight(this.tabBar.node);
    $(this.node).height(h);
  }

  protected onAfterAttach(msg: Message): void {
    if (this.currentWidget instanceof JVMOptionsWidget) {
      MessageLoop.sendMessage(this.parent, new Message('show-result'));
    } else {
      MessageLoop.sendMessage(this.parent, new Message('hide-result'));
    }

    this.currentChanged.connect((s, a) => {
      if (a.currentWidget instanceof JVMOptionsWidget) {
        MessageLoop.sendMessage(this.parent, new Message('show-result'));
      } else {
        MessageLoop.sendMessage(this.parent, new Message('hide-result'));
      }
    }, this);

    super.onAfterAttach(msg);
  }
}
