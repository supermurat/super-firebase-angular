// tslint:disable:max-line-length object-literal-key-quotes
export const myData = {
    'articles_en-US': {
        'first-article': {
            id: 'first-article', routePath: '/article', orderNo: -1, i18nKey: 'first-article',
            title: 'First Article', content: 'this is good article', contentSummary: 'good article',
            created: {seconds: 1544207666}, changed: {seconds: 1544207666},
            image: { alt: '' }
        },
        'second-article': {
            id: 'second-article', routePath: '/article', orderNo: -2, i18nKey: 'second-article',
            title: 'Second Article', content: 'this is better article',
            created: {seconds: 1544207667}, changed: {seconds: 1544207666},
            taxonomy: {
                'first-tag': 'First Tag',
                'old-tag': 'Old Tag'
            }
        },
        'third-article': {
            id: 'third-article', routePath: '/article', orderNo: -3, i18nKey: 'third-article',
            title: 'Third Article', content: 'this is the best article',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666},
            taxonomy: {
                'first-tag': 'First Tag',
                'third-tag': 'Third Tag'
            }
        },
        'fourth-article': {
            id: 'fourth-article', routePath: '/article', orderNo: -4, i18nKey: 'fourth-article',
            title: 'Fourth Article', content: 'this is the best article, this is the best article, this is the best article,' +
                'this is the best article, this is the best article, this is the best article, this is the best article' +
                'this is the best article, this is the best article, this is the best article, this is the best article' +
                'this is the best article, this is the best article, this is the best article, this is the best article',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        },
        'fifth-article': {
            id: 'fifth-article', routePath: '/article', orderNo: -5, i18nKey: 'fifth-article',
            title: 'Fifth Article', content: 'this is the best article',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666},
            locales: [
                {
                    cultureCode: 'tr-TR',
                    slug: 'tr/makale/besinci-makale'
                }
            ],
            description: 'Perfect article ever, you have to check out this!'
        },
        'only-in-en-article': {
            id: 'only-in-en-article', routePath: '/article', orderNo: -5, i18nKey: 'only-in-en-article',
            title: 'Only In En Article', content: 'this is the only in en article',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        }
    },
    'articles_tr-TR': {
        'ilk-makale': {
            id: 'ilk-makale', routePath: '/makale', orderNo: -1, i18nKey: 'first-article',
            title: 'İlk Makale', content: 'bu güzel bir makale', contentSummary: 'güzel makale',
            created: {seconds: 1544207666}, changed: {seconds: 1544207666},
            image: { alt: '' }
        },
        'ikinci-makale': {
            id: 'ikinci-makale', routePath: '/makale', orderNo: -2, i18nKey: 'second-article',
            title: 'İkinci Makale', content: 'bu daha güzel bir makale',
            created: {seconds: 1544207667}, changed: {seconds: 1544207666},
            taxonomy: {
                'ilk-etiket': 'İlk Etiket',
                'eski-etiket': 'Eski Etiket'
            }
        },
        'ucuncu-makale': {
            id: 'ucuncu-makale', routePath: '/makale', orderNo: -3, i18nKey: 'third-article',
            title: 'Üçüncü Makale', content: 'bu en güzel makale',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666},
            taxonomy: {
                'ilk-etiket': 'İlk Etiket',
                'ucuncu-etiket': 'Üçüncü Etiket'
            }
        },
        'dorduncu-makale': {
            id: 'dorduncu-makale', routePath: '/makale', orderNo: -4, i18nKey: 'fourth-article',
            title: 'Dördüncü Makale', content: 'bu en güzel makale, bu en güzel makale, bu en güzel makale, bu en güzel makale, ' +
                'bu en güzel makale, bu en güzel makale, bu en güzel makale, bu en güzel makale, bu en güzel makale, ' +
                'bu en güzel makale, bu en güzel makale, bu en güzel makale, bu en güzel makale, bu en güzel makale, ' +
                'bu en güzel makale, bu en güzel makale, bu en güzel makale, bu en güzel makale, bu en güzel makale',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        },
        'besinci-makale': {
            id: 'besinci-makale', routePath: '/makale', orderNo: -5, i18nKey: 'fifth-article',
            title: 'Beşinci Makale', content: 'bu en güzel makale',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666},
            locales: [
                {
                    cultureCode: 'en-US',
                    slug: 'en/article/fifth-article'
                }
            ],
            description: 'Gelmiş geçmiş en iyi makale, mutlaka bir göz atmalısınız!'
        },
        'sadece-turkce-makale': {
            id: 'sadece-turkce-makale', routePath: '/makale', orderNo: -5, i18nKey: 'sadece-turkce-makale',
            title: 'Sadece Türkçe Makale', content: 'bu sadece türkçe olan makale',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        }
    },
    'blogs_en-US': {
        'first-blog': {
            id: 'first-blog', routePath: '/blog', orderNo: -1, i18nKey: 'first-blog',
            title: 'First Blog', content: 'this is good blog', contentSummary: 'good blog'
        },
        'second-blog': {
            id: 'second-blog', routePath: '/blog', orderNo: -2, i18nKey: 'second-blog',
            title: 'Second Blog', content: 'this is better blog',
            created: {seconds: 1544207666}, changed: {seconds: 1544207666},
            playWithMe: true
        },
        'third-blog': {
            id: 'third-blog', routePath: '/blog', orderNo: -3, i18nKey: 'third-blog',
            title: 'Third Blog', content: 'this is the best blog',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        },
        'only-in-en-blog': {
            id: 'only-in-en-blog', routePath: '/blog', orderNo: -5, i18nKey: 'only-in-en-blog',
            title: 'Only In En Blog', content: 'this is the only in en blog',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        }
    },
    'blogs_tr-TR': {
        'ilk-gunluk': {
            id: 'ilk-gunluk', routePath: '/gunluk', orderNo: -1, i18nKey: 'first-blog',
            title: 'İlk Günlük', content: 'bu güzel bir günlük', contentSummary: 'güzel günlük',
            created: {seconds: 1544207666}, changed: {seconds: 1544207666}
        },
        'ikinci-gunluk': {
            id: 'ikinci-gunluk', routePath: '/gunluk', orderNo: -2, i18nKey: 'second-blog',
            title: 'İkinci Günlük', content: 'bu daha güzel bir günlük',
            playWithMe: true
        },
        'ucuncu-gunluk': {
            id: 'ucuncu-gunluk', routePath: '/gunluk', orderNo: -3, i18nKey: 'third-blog',
            title: 'Üçüncü Günlük', content: 'bu en güzel günlük',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        },
        'sadece-turkce-gunluk': {
            id: 'sadece-turkce-gunluk', routePath: '/gunluk', orderNo: -5, i18nKey: 'sadece-turkce-gunluk',
            title: 'Sadece Türkçe Günlük', content: 'bu sadece türkçe olan günlük',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        }
    },
    'jokes_en-US': {
        'first-joke': {
            id: 'first-joke', routePath: '/joke', orderNo: -1, i18nKey: 'first-joke',
            title: 'First Joke', content: 'this is good joke', contentSummary: 'good joke',
            created: {seconds: 1544207666}, changed: {seconds: 1544207666},
            taxonomy: {
                'old-tag': 'Old Tag'
            }
        },
        'second-joke': {
            id: 'second-joke', routePath: '/joke', orderNo: -2, i18nKey: 'second-joke',
            title: 'Second Joke', content: 'this is better joke',
            created: {seconds: 1544207667}, changed: {seconds: 1544207666},
            taxonomy: {
                'first-tag': 'First Tag'
            }
        },
        'third-joke': {
            id: 'third-joke', routePath: '/joke', orderNo: -3, i18nKey: 'third-joke',
            title: 'Third Joke', content: 'this is the best joke',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        },
        'only-in-en-joke': {
            id: 'only-in-en-joke', routePath: '/joke', orderNo: -5, i18nKey: 'only-in-en-joke',
            title: 'Only In En Joke', content: 'this is the only in en joke',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        }
    },
    'jokes_tr-TR': {
        'ilk-saka': {
            id: 'ilk-saka', routePath: '/saka', orderNo: -1, i18nKey: 'first-joke',
            title: 'İlk Şaka', content: 'bu güzel bir şaka', contentSummary: 'güzel şaka',
            created: {seconds: 1544207666}, changed: {seconds: 1544207666},
            taxonomy: {
                'eski-etiket': 'Eski Etiket'
            }
        },
        'ikinci-fikra': {
            id: 'ikinci-fikra', routePath: '/fikra', orderNo: -2, i18nKey: 'second-joke',
            title: 'İkinci Fıkra', content: 'bu daha güzel bir fıkra',
            created: {seconds: 1544207667}, changed: {seconds: 1544207666},
            taxonomy: {
                'ilk-etiket': 'İlk Etiket'
            }
        },
        'ucuncu-espri': {
            id: 'ucuncu-espri', routePath: '/espri', orderNo: -3, i18nKey: 'third-joke',
            title: 'Üçüncü Espri', content: 'bu en güzel espri',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        },
        'sadece-turkce-fikra': {
            id: 'sadece-turkce-fikra', routePath: '/fikra', orderNo: -5, i18nKey: 'sadece-turkce-fikra',
            title: 'Sadece Türkçe Fıkra', content: 'bu sadece türkçe olan fıkra',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        }
    },
    'pages_en-US': {
        home: {
            id: 'home',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - Let me make you smile :-)',
            routePath: '/',
            i18nKey: 'home',
            orderNo: -1,
            __collection__contents: {
                'article_first-article': {
                    id: 'article_first-article', path: 'first-article', routePath: '/article', orderNo: -1,
                    title: 'First Article', contentSummary: 'good article',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                'article_second-article': {
                    id: 'article_second-article', path: 'second-article', routePath: '/article', orderNo: -2,
                    title: 'Second Article', contentSummary: 'better article',
                    created: {seconds: 1544207667}, changed: {seconds: 1544207666}
                },
                'article_third-article': {
                    id: 'article_third-article', path: 'third-article', routePath: '/article', orderNo: -3,
                    title: 'Third Article', contentSummary: 'the best article',
                    created: {seconds: 1544207668}, changed: {seconds: 1544207666}
                }
            },
            carousel: {
                carouselItems: [
                    {
                        src: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/carousels/carousel-1.jpg',
                        caption: 'Welcome to endless world!'
                    },
                    {
                        src: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/carousels/carousel-2.jpg',
                        caption: 'Isn\'t it beautiful?'
                    },
                    {
                        src: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/carousels/carousel-23.jpg',
                        caption: 'Hey, what\'s up ? '
                    }]
            },
            seo: {
                names: {
                    robots: 'index, follow',
                    author: 'unit-test',
                    owner: 'unit-test',
                    copyright: 'Unit Test 2019',
                    'twitter:title': 'Twitter : Super Murat - Let me make you smile :-)',
                    'twitter:card': 'summary',
                    'twitter:site': '@UnitTest',
                    'twitter:creator': '@UnitTest'
                },
                properties: {
                    'fb:app_id': '123456',
                    'fb:admins': '000001',
                    'og:title': 'Facebook : Super Murat - Let me make you smile :-)',
                    'og:type': 'article',
                    'og:site_name': 'Super Murat'
                }
            },
            jsonLDs: [
                {
                    '@context': 'http://schema.org/',
                    '@type': 'Person',
                    jobTitle: 'Software Developer',
                    name: 'Murat Demir',
                    url: 'https://supermurat.com'
                },
                {
                    '@type': 'Person',
                    jobTitle: 'Software Developer',
                    name: 'Murat Demir',
                    url: 'https://supermurat.com'
                }
            ]
        },
        articles: {
            id: 'articles',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - My Articles',
            caption: 'My Articles',
            routePath: '/',
            i18nKey: 'articles',
            orderNo: -1,
            seo: {},
            jsonLDs: [{
                '@context': 'http://schema.org/',
                '@type': 'Person',
                jobTitle: 'Software Developer',
                name: 'Murat Demir',
                url: 'https://supermurat.com'
            }]
        },
        blogs: {
            id: 'blogs',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - My Blog',
            caption: 'My Blog',
            routePath: '/',
            i18nKey: 'blogs',
            orderNo: -1,
            backgroundCoverImage: {src: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/carousels/carousel-2.jpg'},
            seo: {},
            jsonLDs: []
        },
        jokes: {
            id: 'jokes',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - My Jokes',
            caption: 'My Jokes',
            routePath: '/',
            i18nKey: 'jokes',
            orderNo: -2
        },
        quotes: {
            id: 'quotes',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - My Quotes',
            caption: 'My Quotes',
            routePath: '/',
            i18nKey: 'quotes',
            orderNo: -1
        },
        contact: {
            id: 'contact',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - Contact',
            caption: 'Contact',
            routePath: '/',
            i18nKey: 'contact',
            orderNo: -1
        }
    },
    'pages_tr-TR': {
        home: {
            id: 'home',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Süper Murat - İzin verin gülümseteyim :-)',
            routePath: '/',
            i18nKey: 'home',
            orderNo: -1,
            __collection__contents: {
                'makale_ilk-makale': {
                    id: 'makale_ilk-makale', path: 'ilk-makale', routePath: '/makale', orderNo: -1,
                    title: 'İlk Makale', contentSummary: 'güzel makale',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                'saka_ilk-saka': {
                    id: 'saka_ilk-saka', path: 'ilk-saka', routePath: '/saka', orderNo: -2,
                    title: 'İlk Şaka', contentSummary: 'güzel şaka',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                'alinti_ilk-alinti': {
                    id: 'alinti_ilk-alinti', path: 'ilk-alinti', routePath: '/alinti', orderNo: -3,
                    title: 'İlk Alıntı', contentSummary: 'güzel alıntı',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                }
            },
            carousel: {
                carouselItems: [
                    {
                        src: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/carousels/carousel-1.jpg',
                        caption: 'Sonsuz dünyaya hoşgeldiniz!'
                    },
                    {
                        src: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/carousels/carousel-2.jpg',
                        caption: 'Harika değil mi?'
                    },
                    {
                        src: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/carousels/carousel-23.jpg',
                        caption: 'Hey, naber?'
                    }]
            },
            seo: {
                names: {
                    robots: 'index, follow',
                    author: 'unit-test',
                    owner: 'unit-test',
                    copyright: 'Unit Test 2019',
                    'twitter:title': 'Twitter : Süper Murat - İzin verin gülümseteyim :-)',
                    'twitter:card': 'summary',
                    'twitter:site': '@UnitTest',
                    'twitter:creator': '@UnitTest'
                },
                properties: {
                    'fb:app_id': '123456',
                    'fb:admins': '000001',
                    'og:title': 'Facebook : Süper Murat - İzin verin gülümseteyim :-)',
                    'og:type': 'article',
                    'og:site_name': 'Süper Murat'
                }
            },
            jsonLDs: [
                {
                    '@context': 'http://schema.org/',
                    '@type': 'Person',
                    jobTitle: 'Software Developer',
                    name: 'Murat Demir',
                    url: 'https://supermurat.com'
                },
                {
                    '@type': 'Person',
                    jobTitle: 'Software Developer',
                    name: 'Murat Demir',
                    url: 'https://supermurat.com'
                }
            ]
        },
        makaleler: {
            id: 'makaleler',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - Makalelerim',
            caption: 'Makalelerim',
            routePath: '/',
            i18nKey: 'articles',
            orderNo: -1,
            seo: {},
            jsonLDs: [{
                '@context': 'http://schema.org/',
                '@type': 'Person',
                jobTitle: 'Software Developer',
                name: 'Murat Demir',
                url: 'https://supermurat.com'
            }]
        },
        gunlukler: {
            id: 'gunlukler',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - Günlüğüm',
            caption: 'Günlüğüm',
            routePath: '/',
            i18nKey: 'blogs',
            orderNo: -1,
            backgroundCoverImage: {src: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/carousels/carousel-2.jpg'},
            seo: {},
            jsonLDs: []
        },
        eglence: {
            id: 'eglence',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - Eğlence Zamanı',
            caption: 'Eğlence Zamanı',
            routePath: '/',
            i18nKey: 'jokes',
            orderNo: -2
        },
        fikralar: {
            id: 'fikralar',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - Fıkralarım',
            caption: 'Fıkralarım',
            routePath: '/',
            i18nKey: 'jokes',
            orderNo: -1
        },
        alintilar: {
            id: 'alintilar',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - Alıntılarım',
            caption: 'Alıntılarım',
            routePath: '/',
            i18nKey: 'quotes',
            orderNo: -1
        },
        'guzel-sozler': {
            id: 'guzel-sozler',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - Güzel Sözlerim',
            caption: 'Güzel Sözlerim',
            routePath: '/',
            i18nKey: 'quotes',
            orderNo: -1
        },
        iletisim: {
            id: 'iletisim',
            changed: {seconds: 1544207666},
            created: {seconds: 1544207666},
            title: 'Super Murat - İletişim',
            caption: 'İletişim',
            routePath: '/',
            i18nKey: 'contact',
            orderNo: -1
        }
    },
    firstResponses: {
        'first-cache': {
            id: 'first-cache', code: 200, type: 'cache', content: '<html>First Cache</html>',
            expireDate: {seconds: Math.round(new Date().setDate(Number(new Date().getDate()) + 30) / 1000)}
        },
        'second-cache': {
            id: 'second-cache', code: 404, type: 'cache',
            expireDate: {seconds: Math.round(new Date().setDate(Number(new Date().getDate()) + 15) / 1000)}
        },
        'third-cache': {
            id: 'third-cache', code: 404, type: 'cache',
            expireDate: {seconds: Math.round(new Date().setDate(Number(new Date().getDate()) - 10) / 1000)}
        },
        'forth-cache': {
            id: 'forth-cache', code: 301, type: 'cache', url: '/first-cache',
            expireDate: {seconds: Math.round(new Date().setDate(Number(new Date().getDate()) - 5) / 1000)}
        },
        'fifth-cache': {
            id: 'fifth-cache', code: 200, type: 'cache', content: '<html>Fifth Cache</html>'
        },
        'robots.txt': {
            id: 'robots.txt', code: 200, type: 'file', content: 'User-Agent: *\r\nDisallow: / \r\n\r\n\r\n'
        }
    },
    'quotes_en-US': {
        'first-quote': {
            id: 'first-quote', routePath: '/quote', orderNo: -1, i18nKey: 'first-quote',
            title: 'First Quote', content: 'this is good quote', contentSummary: 'good quote',
            created: {seconds: 1544207666}, changed: {seconds: 1544207666},
            persons: {
                'Person 1': 'First Person',
                'Person 2': 'Other Person'
            }
        },
        'second-quote': {
            id: 'second-quote', routePath: '/quote', orderNo: -2, i18nKey: 'second-quote',
            title: 'Second Quote', content: 'this is better quote',
            created: {seconds: 1544207667}, changed: {seconds: 1544207666},
            persons: {
                Person: 'Only Person'
            }
        },
        'third-quote': {
            id: 'third-quote', routePath: '/quote', orderNo: -3, i18nKey: 'third-quote',
            title: 'Third Quote', content: 'this is the best quote',
            created: {seconds: 1544207669}, changed: {seconds: 1544207666},
            whoSaidThat: 'Super Murat'
        },
        'only-in-en-quote': {
            id: 'only-in-en-quote', routePath: '/quote', orderNo: -5, i18nKey: 'only-in-en-quote',
            title: 'Only In En Quote', content: 'this is the only in en quote',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        }
    },
    'quotes_tr-TR': {
        'ilk-alinti': {
            id: 'ilk-alinti', routePath: '/alinti', orderNo: -1, i18nKey: 'first-quote',
            title: 'İlk Alıntı', content: 'bu güzel bir alıntı', contentSummary: 'güzel alıntı',
            created: {seconds: 1544207666}, changed: {seconds: 1544207666},
            persons: {
                'Kisi 1': 'İlk Kişi',
                'Kisi 2': 'Diğer Kişi'
            }
        },
        'ikinci-guzel-soz': {
            id: 'ikinci-guzel-soz', routePath: '/guzel-soz', orderNo: -2, i18nKey: 'second-quote',
            title: 'İkinci Güzel Söz', content: 'bu daha güzel bir söz',
            created: {seconds: 1544207667}, changed: {seconds: 1544207666},
            persons: {
                Kisi: 'Tek Kişi'
            }
        },
        'ucuncu-guzel-soz': {
            id: 'ucuncu-guzel-soz', routePath: '/guzel-soz', orderNo: -3, i18nKey: 'third-quote',
            title: 'Üçüncü Güzel Söz', content: 'bu en güzel söz',
            created: {seconds: 1544207669}, changed: {seconds: 1544207666},
            whoSaidThat: 'Super Murat'
        },
        'sadece-turkce-alinti': {
            id: 'sadece-turkce-alinti', routePath: '/alinti', orderNo: -5, i18nKey: 'sadece-turkce-alinti',
            title: 'Sadece Türkçe Alıntı', content: 'bu sadece türkçe olan alıntı',
            created: {seconds: 1544207668}, changed: {seconds: 1544207666}
        }
    },
    'taxonomy_en-US': {
        'first-tag': {
            id: 'first-tag', routePath: '/tag', orderNo: -1, i18nKey: 'first-tag',
            title: 'Related Contents to "First Tag"',
            tagName: 'First Tag',
            created: {seconds: 1544207666},
            changed: {seconds: 1544207666},
            __collection__contents: {
                '_article_first-article': {
                    id: '_article_first-article', path: 'first-article', routePath: '/article', orderNo: -1,
                    title: 'First Article', contentSummary: 'good article',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                '_article_second-article': {
                    id: '_article_second-article', path: 'second-article', routePath: '/article', orderNo: -2,
                    title: 'Second Article', contentSummary: 'better article',
                    created: {seconds: 1544207667}, changed: {seconds: 1544207666}
                },
                '_article_third-article': {
                    id: '_article_third-article', path: 'third-article', routePath: '/article', orderNo: -3,
                    title: 'Third Article', contentSummary: 'the best article',
                    created: {seconds: 1544207668}, changed: {seconds: 1544207666}
                },
                '_joke_first-joke': {
                    id: '_joke_first-joke', path: 'first-joke', routePath: '/joke', orderNo: -4,
                    title: 'First Joke', contentSummary: 'good joke',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                '_joke_second-joke': {
                    id: '_joke_second-joke', path: 'second-joke', routePath: '/joke', orderNo: -5,
                    title: 'Second Joke', contentSummary: 'better joke',
                    created: {seconds: 1544207667}, changed: {seconds: 1544207666}
                },
                '_joke_third-joke': {
                    id: '_joke_third-joke', path: 'third-joke', routePath: '/joke', orderNo: -6,
                    title: 'Third Joke', contentSummary: 'the best joke',
                    created: {seconds: 1544207668}, changed: {seconds: 1544207666}
                },
                '_quote_first-quote': {
                    id: '_quote_first-quote', path: 'first-quote', routePath: '/quote', orderNo: -7,
                    title: 'First Quote', contentSummary: 'good quote',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                '_quote_second-quote': {
                    id: '_quote_second-quote', path: 'second-quote', routePath: '/quote', orderNo: -8,
                    title: 'Second Quote', contentSummary: 'better quote',
                    created: {seconds: 1544207667}, changed: {seconds: 1544207666}
                }
            }
        },
        'second-tag': {
            id: 'second-tag', routePath: '/tag', orderNo: -2, i18nKey: 'second-tag',
            title: 'Related Contents to "Second Tag"',
            tagName: 'Second Tag',
            created: {seconds: 1544207667},
            changed: {seconds: 1544207666}
        },
        'third-tag': {
            id: 'third-tag', routePath: '/tag', orderNo: -3, i18nKey: 'third-tag',
            title: 'Related Contents to "Third Tag"',
            tagName: 'Third Tag',
            created: {seconds: 1544207668},
            changed: {seconds: 1544207666}
        }
    },
    'taxonomy_tr-TR': {
        'ilk-etiket': {
            id: 'ilk-etiket', routePath: '/etiket', orderNo: -1, i18nKey: 'first-tag',
            title: '"İlk Etiket" ile Alakalı İçerikler',
            tagName: 'İlk Etiket',
            created: {seconds: 1544207666},
            changed: {seconds: 1544207666},
            __collection__contents: {
                '_makale_ilk-makale': {
                    id: '_makale_ilk-makale', path: 'ilk-makale', routePath: '/makale', orderNo: -1,
                    title: 'İlk Makale', contentSummary: 'güzel makale',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                '_makale_ikinci-makale': {
                    id: '_makale_ikinci-makale', path: 'ikinci-makale', routePath: '/makale', orderNo: -1,
                    title: 'İkinci Makale', contentSummary: 'bu daha güzel bir makale',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                '_makale_ucuncu-makale': {
                    id: '_makale_ucuncu-makale', path: 'ucuncu-makale', routePath: '/makale', orderNo: -1,
                    title: 'Üçüncü Makale', contentSummary: 'bu en güzel makale',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                '_saka_ilk-saka': {
                    id: '_saka_ilk-saka', path: 'ilk-saka', routePath: '/saka', orderNo: -2,
                    title: 'İlk Şaka', contentSummary: 'güzel şaka',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                '_fikra_ikinci-fikra': {
                    id: '_fikra_ikinci-fikra', path: 'ikinci-fikra', routePath: '/fikra', orderNo: -2,
                    title: 'İkinci Fıkra', contentSummary: 'bu daha güzel bir fıkra',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                '_espri_ucuncu-espri': {
                    id: '_espri_ucuncu-espri', path: 'ucuncu-espri', routePath: '/espri', orderNo: -2,
                    title: 'Üçüncü Espri', contentSummary: 'bu en güzel espri',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                '_alinti_ilk-alinti': {
                    id: '_alinti_ilk-alinti', path: 'ilk-alinti', routePath: '/alinti', orderNo: -3,
                    title: 'İlk Alıntı', contentSummary: 'güzel alıntı',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                },
                '_alinti_ikinci-alinti': {
                    id: '_alinti_ikinci-alinti', path: 'ikinci-alinti', routePath: '/alinti', orderNo: -3,
                    title: 'İkinci Alıntı', contentSummary: 'güzel alıntı',
                    created: {seconds: 1544207666}, changed: {seconds: 1544207666}
                }
            }
        },
        'ikinci-etiket': {
            id: 'ikinci-etiket', routePath: '/etiket', orderNo: -2, i18nKey: 'second-tag',
            title: '"İkinci Etiket" ile Alakalı İçerikler',
            tagName: 'İkinci Etiket',
            created: {seconds: 1544207667},
            changed: {seconds: 1544207666}
        },
        'ucuncu-etiket': {
            id: 'ucuncu-etiket', routePath: '/etiket', orderNo: -3, i18nKey: 'third-tag',
            title: '"Üçüncü Etiket" ile Alakalı İçerikler',
            tagName: 'Üçüncü Etiket',
            created: {seconds: 1544207668},
            changed: {seconds: 1544207666}
        }
    },
    'messages_en-US': {
        '1q2w3e4r5t6y7u8i9o0pEn': {
            userLongName: 'Unit Test',
            email: 'unit@test.com',
            message: 'This is for test!',
            isSendCopyToOwner: true,
            isAgreed: true
        }
    },
    'messages_tr-TR': {
        '1q2w3e4r5t6y7u8i9o0pTr': {
            userLongName: 'Unit Test',
            email: 'unit@test.com',
            message: 'Bu test içindir!',
            isSendCopyToOwner: true,
            isAgreed: true
        }
    },
    configs: {
        'private_en-US': {
            mail: {
                siteURL: 'https://unittest.com',
                mailFrom: 'from@unittest.com',
                siteName: 'Super Unit Test',
                automaticallyGeneratedEmailNote: 'This is an automatically generated email.',
                mailAddressOfAdmin: 'admin@unittest.com',
                isSendMail: true
            },
            smtp: {
                port: 465,
                host: 'smtp.unittest.com',
                secure: true,
                auth: {
                    user: 'sender@unittest.com',
                    pass: 'unittest'
                }
            }
        },
        'private_tr-TR': {
            mail: {
                siteURL: 'https://unittest.com',
                mailFrom: 'from@unittest.com',
                siteName: 'Süper Unit Test',
                automaticallyGeneratedEmailNote: 'Bu e-posta size otomatik olarak gönderilmiştir.',
                mailAddressOfAdmin: 'admin@unittest.com',
                isSendMail: true
            },
            smtp: {
                port: 465,
                host: 'smtp.unittest.com',
                secure: true,
                auth: {
                    user: 'sender@unittest.com',
                    pass: 'unittest'
                }
            }
        },
        'public_en-US': {
            mainMenuItems: [
                {
                    url: '/home',
                    text: 'Home'
                },
                {
                    url: '/blogs',
                    text: 'Blog'
                },
                {
                    url: '/articles',
                    text: 'Articles'
                },
                {
                    url: '/jokes',
                    text: 'Jokes'
                },
                {
                    url: '/quotes',
                    text: 'Quotes'
                }
            ],
            primaryCustomHtmlWidget: {
                title: 'Project is Ready',
                content: '<b>You will get more info soon...</b>'
            },
            configSEO: {
                defaultImageForSEO: {
                    src: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/HamsiManager-256.png',
                    src1x1: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/HamsiManager-256.png',
                    src4x3: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/HamsiManager-256.png',
                    src16x9: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/HamsiManager-256.png'
                },
                defaultPublisher: {
                    logo: {
                        '@type': 'ImageObject',
                        height: 60,
                        url: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/carousels/carousel-1.jpg',
                        width: 600
                    },
                    name: 'Murat Demir'
                }
            },
            footerBlocks: [
                {
                    title: 'About',
                    menuItems: [],
                    content: '<p>This is sample</p>'
                },
                {
                    content: '',
                    title: 'Content',
                    menuItems: [
                        {
                            text: 'Blog',
                            url: '/blogs'
                        },
                        {
                            text: 'Articles',
                            url: '/articles'
                        },
                        {
                            text: 'Quotes',
                            url: '/quotes'
                        }
                    ]
                },
                {
                    content: '',
                    title: 'Jokes',
                    menuItems: [
                        {
                            text: 'Jokes',
                            url: '/jokes'
                        }
                    ]
                },
                {
                    content: '',
                    title: 'Developer Zone',
                    menuItems: [
                        {
                            text: 'Playground',
                            url: '/playground'
                        },
                        {
                            url: '/coverage',
                            rel: 'noopener',
                            target: '_blank',
                            text: 'Coverage'
                        },
                        {
                            rel: 'noopener',
                            target: '_blank',
                            text: 'Documentation',
                            url: '/documentation'
                        }
                    ]
                }
            ]
        },
        'public_tr-TR': {
            mainMenuItems: [
                {
                    url: '/home',
                    text: 'Anasayfa'
                },
                {
                    url: '/gunlukler',
                    text: 'Günlük'
                },
                {
                    url: '/makaleler',
                    text: 'Makaleler'
                },
                {
                    url: '/eglence',
                    text: 'Eğlence'
                },
                {
                    url: '/alintilar',
                    text: 'Alıntılar'
                }
            ],
            primaryCustomHtmlWidget: {
                title: 'Proje Hazır',
                content: '<b>Yakında daha fazla bilgi alacaksınız...</b>'
            },
            configSEO: {
                defaultImageForSEO: {
                    src: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/HamsiManager-256.png'
                },
                defaultPublisher: {
                    logo: {
                        '@type': 'ImageObject',
                        height: 60,
                        url: 'https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/carousels/carousel-1.jpg',
                        width: 600
                    },
                    name: 'Murat Demir'
                }
            },
            footerBlocks: [
                {
                    content: '<p>Bu bir örnek</p>',
                    title: 'Hakkında',
                    menuItems: []
                },
                {
                    content: '',
                    title: 'İçerik',
                    menuItems: [
                        {
                            text: 'Günlük',
                            url: '/gunlukler'
                        },
                        {
                            text: 'Makaleler',
                            url: '/makaleler'
                        },
                        {
                            text: 'Alıntılar',
                            url: '/alintilar'
                        }
                    ]
                },
                {
                    content: '',
                    title: 'Eğlence',
                    menuItems: [
                        {
                            text: 'Şakalar',
                            url: '/eglence'
                        }
                    ]
                },
                {
                    content: '',
                    title: 'Developer Zone',
                    menuItems: [
                        {
                            text: 'Playground',
                            url: '/playground'
                        },
                        {
                            text: 'Coverage',
                            url: '/coverage',
                            rel: 'noopener',
                            target: '_blank'
                        },
                        {
                            target: '_blank',
                            text: 'Documentation',
                            url: '/documentation',
                            rel: 'noopener'
                        }
                    ]
                }
            ]
        }
    },
    users: {
        'super-user': {
            uid: 'super-user',
            email: 'super-user@example.com',
            displayName: 'Super User'
        }
    }
};
