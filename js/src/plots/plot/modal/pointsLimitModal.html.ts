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

export const html = `
<!-- Modal -->
<div id="<%=scopeId%>_modal_dialog" style="display: none">
    <div class="bko-modal points-limit-modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">Note: plot has too much data to display.
                    The limit is <%=outputPointsLimit%> items, but this plot has <%=numberOfPoints%> items.
                    The first <%=outputPointsPreviewNumber%> are displayed as a preview.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary">OK</button>
                </div>
            </div>
        </div>
    </div>
</div>
`;
