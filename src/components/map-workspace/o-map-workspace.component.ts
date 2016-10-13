import {
  Component,
  Inject,
  forwardRef
} from '@angular/core';
import {
  DragulaService
} from 'ng2-dragula/ng2-dragula';
import {
  OMapComponent,
  OMapLayerComponent,
  OMapLayerGroupComponent
} from '../../components';


@Component({
  selector: 'o-map-workspace',
  moduleId: module.id,
  providers: [],
  inputs: [],
  templateUrl: '/map-workspace/o-map-workspace.component.html',
  styleUrls: ['/map-workspace/o-map-workspace.component.css']
})
export class OMapWorkspaceComponent {
  public wsMapLayers : Array<OMapLayerComponent> = new Array<OMapLayerComponent>();

  constructor(
    @Inject(forwardRef(() => OMapComponent)) private map: OMapComponent,
    private dragulaService: DragulaService) {
    dragulaService.over.subscribe(value => this.onOver(value.slice(1)));
    dragulaService.out.subscribe(value => this.onOut(value.slice(1)));
    dragulaService.setOptions('layer-bag', {
      moves: function (el, container, handle) {
        let iconClicked = handle.tagName === 'MD-ICON' && handle.parentNode.parentNode.classList.contains('drag-handle');
        let buttonClicked = handle.tagName === 'BUTTON' && handle.parentNode.classList.contains('drag-handle');
        return iconClicked || buttonClicked;
      }
    });
  }

  public updateMapLayer(l: OMapLayerComponent) {
    let p : number = this.wsMapLayers.indexOf(l);
    let inML = p > -1;
    let inWS = l.inWS === true;

    if (inWS && !inML) {
      this.wsMapLayers.push(l);
      this.updateMapLayersPosition();
    } else if (!inWS && inML) {
      this.wsMapLayers.splice(p,1);
    }
  }

  public updateMapLayers() {
    this.map.getOMapLayers().forEach(l => this.updateMapLayer(l));
    return this.wsMapLayers;
  }

  public getSelectedMapLayer() : OMapLayerComponent {
    return this.wsMapLayers.filter(l => l.selected === true)[0];
  }

  public getMapLayers(): Array<OMapLayerComponent> {
    return this.wsMapLayers;
  }

  private updateMapLayersPosition() {
    this.wsMapLayers.forEach((l,i) => {
      l.setZIndex(i+2);
    });
  }

/*
  private onDrag(args) {
    let [e, el] = args;
    e.classList.remove('layer-moved');
  }

  private onDrop(args) {
    let [e, el] = args;
    e.classList.add('layer-moved');
  }
*/

  private onOver(args) {
    let [e, el, container] = args;
    e.classList.add('layer-on-movement');
  }

  private onOut(args) {
    let [e, el, container] = args;
    e.classList.remove('layer-on-movement');
    this.updateMapLayersPosition();
  }

}
