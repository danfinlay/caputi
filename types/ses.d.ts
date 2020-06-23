declare var lockdown: Function;
declare class Compartment {
  constructor(endowments: Object);
  evaluate(command: string): any;
  globalThis: any;
}
