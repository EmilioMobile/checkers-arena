export class Player {
  id: number;
  name: string;
  score: number = 0;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
