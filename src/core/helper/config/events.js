import CoreEvents from '../../../etc/events/core/events';
import ExternalEvents from '../../../etc/events/events';

export default class Events {
    static events = {};
    static plugins = [];

    static initAppEvents() {
        this.events = CoreEvents;
        this.loadPluginsEvents();
        this.loadCustomizeEvents();
    }

    static loadPluginsEvents() {
        this.plugins.forEach(plugin => {
            if (plugin.config.enable == '1') {
                this.loadLayoutWithKey(plugin.sku)
            }
        });
    }

    static loadCustomizeEvents() {
        return this.loadLayoutWithKey('customize')
    }

    static loadLayoutWithKey(key) {
        if (ExternalEvents.hasOwnProperty(key)) {
            let pluginEvents = ExternalEvents[key];
            if (pluginEvents) {
              for(let job in pluginEvents){
                  let plugins = pluginEvents[job];
                  for(let i=0; i<plugins.length; i++){
                      if(this.events[job])
                        this.events[job].push(plugins[i]);
                  }
              }
            }
        }
    }

    static dispatchEventAction(params, obj=null, key=null){
      for (let i = 0; i < this.events.actions.length; i++) {
          let node = this.events.actions[i];
          if (node.active === true) {
              let Action = node.content;
              Action(params, obj, key);
          }
      }
    }
    static dispatchEventData(data){
      for (let i = 0; i < this.events.data.length; i++) {
          let node = this.events.data[i];
          if (node.active === true) {
              let Action = node.content;
              Action(data);
          }
      }
    }
}
