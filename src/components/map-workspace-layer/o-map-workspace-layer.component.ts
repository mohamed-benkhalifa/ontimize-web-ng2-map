import { Component, Inject, forwardRef, TemplateRef } from '@angular/core';
import { OMapLayerComponent, OMapWorkspaceComponent } from '../../components';
import { OSearchable, OSearchResult } from '../../interfaces';

@Component({
	selector: 'o-map-workspace-layer',
	moduleId: module.id,
	providers: [],
	inputs: [
		'selected : layer-selected',
		'visible : layer-visible',
		'inWS : layer-in-ws',
		'menuLabel : layer-menu-label',
		'menuLabelSecondary : layer-menu-label-secondary',
		'refLayer : layer-ref'
	],
	templateUrl: '/map-workspace-layer/o-map-workspace-layer.component.html',
	styleUrls: ['/map-workspace-layer/o-map-workspace-layer.component.css']
})
export class OMapWorkspaceLayerComponent implements OSearchable {
	selected: boolean = false;
	visible: boolean = false;
	inWS: boolean = false;
	menuLabel: string;
	menuLabelSecondary: string;
	refLayer: OMapLayerComponent;

	public oSearchKeys: Array<string> = ['menuLabel', 'menuLabelSecondary'];

	constructor(
		@Inject(forwardRef(() => OMapWorkspaceComponent)) private refWorkspace: OMapWorkspaceComponent
	) { }

	get oSearchResult(): OSearchResult {
		return {
			label: this.menuLabel,
			sublabel: this.menuLabelSecondary,
			icon: 'layer',
			buttons: []
		};
	}

	public toggleSelected(status?: boolean) {
		let select = (status !== undefined && !!status) || (!!this.visible && !!this.inWS);
		let unselect = (status !== undefined && !status) || !this.selected;
		if (select) {
			this.refWorkspace.wsMapLayers.forEach(l => l.setSelected(false));
			this.selected = this.refLayer.toggleSelected();
		} else if (unselect) {
			this.selected = this.refLayer.setSelected(false);
		}
	}

	public toggleVisible(status?: boolean, evt?: Event) {
		if (evt) {
			evt.stopPropagation();
		}
		this.visible = this.refLayer.toggleVisible(status);
		if (!this.visible && !!this.selected) {
			this.toggleSelected(false);
		}
	}
	public toggleInWS(status?: boolean) {
		this.inWS = this.refLayer.toggleInWS(status);
		if (!this.inWS && !!this.visible) {
			this.toggleVisible(false);
		}
	}

}
