export default class Filter {
  private list: string[];
  private exclude: string[];

  constructor(badWords: string[]) {
    this.list = badWords;
    this.exclude = [];
  }

  isProfane(str: string) {
    return (
      this.list.filter((word) => {
        const wordExp = new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi');
        return !this.exclude.includes(word.toLowerCase()) && wordExp.test(str);
      }).length > 0
    );
  }

  addWords() {
    const words = Array.from(arguments);

    this.list.push(...words);

    words
      .map((word) => word.toLowerCase())
      .forEach((word) => {
        if (this.exclude.includes(word)) this.exclude.splice(this.exclude.indexOf(word), 1);
      });
  }

  removeWords() {
    this.exclude.push(...Array.from(arguments).map((word) => word.toLowerCase()));
  }
}
