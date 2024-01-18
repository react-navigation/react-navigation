export const COMMON_LINKING_CONFIG = {
  Article: {
    path: 'article/:author?',
    parse: {
      author: (author: string) =>
        author.charAt(0).toUpperCase() + author.slice(1).replace(/-/g, ' '),
    },
    stringify: {
      author: (author: string) => author.toLowerCase().replace(/\s/g, '-'),
    },
  },
  NewsFeed: {
    path: 'feed/:date',
    parse: {
      date: Number,
    },
  },
};
