export interface Item {
  id: string;
  title: string;
  image: string;
}

export interface Category {
  slug: string;
  name: string;
  items: Item[];
}

export const categories: Category[] = [
  {
    slug: 'beatles',
    name: 'Beatles Albums',
    items: [
      {
        id: 'abbey-road',
        title: 'Abbey Road',
        image: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg'
      },
      {
        id: 'sgt-pepper',
        title: "Sgt. Pepper\'s Lonely Hearts Club Band",
        image: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg'
      },
      {
        id: 'revolver',
        title: 'Revolver',
        image: 'https://upload.wikimedia.org/wikipedia/en/1/16/Revolver.jpg'
      },
      {
        id: 'rubber-soul',
        title: 'Rubber Soul',
        image: 'https://upload.wikimedia.org/wikipedia/en/7/74/Rubber_Soul.jpg'
      },
      {
        id: 'let-it-be',
        title: 'Let It Be',
        image: 'https://upload.wikimedia.org/wikipedia/en/2/25/LetItBe.jpg'
      }
    ]
  },
  {
    slug: 'prime-ministers',
    name: 'UK Prime Ministers',
    items: [
      {
        id: 'churchill',
        title: 'Winston Churchill',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Sir_Winston_Churchill_-_19086236948.jpg'
      },
      {
        id: 'thatcher',
        title: 'Margaret Thatcher',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Margaret_Thatcher.png'
      },
      {
        id: 'blair',
        title: 'Tony Blair',
        image: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Tony_Blair_2010_%28cropped%29.jpg'
      },
      {
        id: 'may',
        title: 'Theresa May',
        image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Theresa_May_official_portrait_cropped.jpg'
      },
      {
        id: 'johnson',
        title: 'Boris Johnson',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Boris_Johnson_official_portrait.jpg'
      }
    ]
  },
  {
    slug: '70s-bands',
    name: '70s Bands',
    items: [
      {
        id: 'led-zeppelin',
        title: 'Led Zeppelin',
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Led_Zeppelin_1977.jpg'
      },
      {
        id: 'pink-floyd',
        title: 'Pink Floyd',
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Pink_Floyd_-_all_members.jpg'
      },
      {
        id: 'rolling-stones',
        title: 'The Rolling Stones',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/The_Rolling_Stones_1972.jpg'
      },
      {
        id: 'queen',
        title: 'Queen',
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Queen_1976_cropped.jpg'
      },
      {
        id: 'the-who',
        title: 'The Who',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/The_Who_1970.jpg'
      }
    ]
  },
  {
    slug: 'nolan-movies',
    name: 'Nolan Movies',
    items: [
      {
        id: 'memento',
        title: 'Memento',
        image: 'https://upload.wikimedia.org/wikipedia/en/c/c7/Memento_poster.jpg'
      },
      {
        id: 'dark-knight',
        title: 'The Dark Knight',
        image: 'https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg'
      },
      {
        id: 'inception',
        title: 'Inception',
        image: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg'
      },
      {
        id: 'interstellar',
        title: 'Interstellar',
        image: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg'
      },
      {
        id: 'oppenheimer',
        title: 'Oppenheimer',
        image: 'https://upload.wikimedia.org/wikipedia/en/6/6f/Oppenheimer_%28film%29_poster.jpg'
      }
    ]
  }
];
