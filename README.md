# Description

Backend project based on [Nest](https://github.com/nestjs/nest) framework.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

TODO : Will be done in Digital-ocean

## Stay in touch

- Author - [Naman Sharma](https://twitter.com/kammysliwiec)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


.
├── bash.exe.stackdump
├── docs
│   ├── adminPage.jpeg
│   ├── database 2.diagram
│   ├── homePage.jpeg
│   ├── refWeb.md
│   ├── studentPage.jpeg
│   ├── teacherpage.jpeg
│   ├── Upskillab Website.pdf
│   └── upskills.diagram
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── api
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.logic.ts
│   │   │   ├── auth.module.ts
│   │   │   └── strategy
│   │   │       ├── jwt.strategy.ts
│   │   │       └── local.strategy.ts
│   │   ├── batch
│   │   │   ├── batch.controller.ts
│   │   │   ├── batch.data.ts
│   │   │   ├── batch.logic.ts
│   │   │   └── batch.module.ts
│   │   ├── blog
│   │   │   ├── blog.controller.ts
│   │   │   ├── blog.data.ts
│   │   │   ├── blog.logic.ts
│   │   │   └── blog.module.ts
│   │   ├── category
│   │   │   ├── category.controller.ts
│   │   │   ├── category.data.ts
│   │   │   ├── category.logic.ts
│   │   │   └── category.module.ts
│   │   ├── class-session
│   │   ├── course
│   │   │   ├── chapter
│   │   │   │   ├── chapter.data.ts
│   │   │   │   └── chapter.module.ts
│   │   │   ├── course.controller.ts
│   │   │   ├── course.data.ts
│   │   │   ├── course.logic.ts
│   │   │   ├── course.module.ts
│   │   │   └── topic
│   │   │       ├── topic.data.ts
│   │   │       └── topic.module.ts
│   │   ├── demosessions
│   │   │   ├── demosession.controller.ts
│   │   │   ├── demosession.data.ts
│   │   │   ├── demosession.logic.ts
│   │   │   └── demosession.module.ts
│   │   ├── doubt-session
│   │   │   ├── doubt-session.controller.ts
│   │   │   ├── doubt-session.data.ts
│   │   │   └── doubt-session.logic.ts
│   │   ├── enrollment
│   │   │   ├── enrollment.controller.ts
│   │   │   ├── enrollment.data.ts
│   │   │   ├── enrollment.logic.ts
│   │   │   └── enrollment.module.ts
│   │   ├── faq
│   │   │   ├── faq.controller.ts
│   │   │   ├── faq.data.ts
│   │   │   ├── faq.logic.ts
│   │   │   └── faq.module.ts
│   │   ├── file
│   │   │   ├── file.controller.ts
│   │   │   └── file.module.ts
│   │   ├── language
│   │   │   ├── language.controller.ts
│   │   │   ├── language.data.ts
│   │   │   ├── language.logic.ts
│   │   │   └── language.module.ts
│   │   ├── login-attempt
│   │   │   ├── login-attempt.data.ts
│   │   │   └── login-attempt.module.ts
│   │   ├── order
│   │   │   ├── order.controller.ts
│   │   │   ├── order.data.ts
│   │   │   ├── order.logic.ts
│   │   │   └── order.module.ts
│   │   ├── payment
│   │   │   ├── cashfree.logic.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.data.ts
│   │   │   ├── payment.logic.ts
│   │   │   └── payment.module.ts
│   │   ├── public
│   │   │   ├── banner
│   │   │   │   ├── banner.controller.ts
│   │   │   │   ├── banner.data.ts
│   │   │   │   ├── banner.logic.ts
│   │   │   │   └── banner.module.ts
│   │   │   ├── banner3
│   │   │   │   ├── banner3.controller.ts
│   │   │   │   ├── banner3.data.ts
│   │   │   │   ├── banner3.logic.ts
│   │   │   │   └── banner3.module.ts
│   │   │   ├── banner4
│   │   │   │   ├── banner4.controller.ts
│   │   │   │   ├── banner4.data.ts
│   │   │   │   ├── banner4.logic.ts
│   │   │   │   └── banner4.module.ts
│   │   │   ├── contact-us
│   │   │   │   ├── contact-us.controller.ts
│   │   │   │   ├── contact-us.data.ts
│   │   │   │   ├── contact-us.logic.ts
│   │   │   │   └── contact-us.module.ts
│   │   │   ├── hiring-partner
│   │   │   │   ├── hiring-partner.controller.ts
│   │   │   │   ├── hiring-partner.data.ts
│   │   │   │   ├── hiring-partner.logic.ts
│   │   │   │   └── hiring-partner.module.ts
│   │   │   ├── premium-learning-experience
│   │   │   │   ├── premium-learning-experience.controller.ts
│   │   │   │   ├── premium-learning-experience.data.ts
│   │   │   │   ├── premium-learning-experience.logic.ts
│   │   │   │   └── premium-learning-experience.module.ts
│   │   │   ├── stats
│   │   │   │   ├── stats.controller.ts
│   │   │   │   ├── stats.data.ts
│   │   │   │   ├── stats.logic.ts
│   │   │   │   └── stats.module.ts
│   │   │   └── youtube
│   │   │       ├── youtube.controller.ts
│   │   │       ├── youtube.data.ts
│   │   │       ├── youtube.logic.ts
│   │   │       ├── youtube.module.ts
│   │   │       └── youtube.service.ts
│   │   ├── recorded-video
│   │   │   ├── recorded-video.controller.ts
│   │   │   ├── recorded-video.data.ts
│   │   │   ├── recorded-video.logic.ts
│   │   │   └── recorded-video.module.ts
│   │   ├── registration
│   │   │   ├── registration.controller.ts
│   │   │   ├── registration.logic.ts
│   │   │   └── registration.module.ts
│   │   ├── scheduler
│   │   │   ├── class-session.controller.ts
│   │   │   ├── class-session.data.ts
│   │   │   ├── class-session.logic.ts
│   │   │   └── class-session.module.ts
│   │   ├── stories
│   │   │   ├── stories.controller.ts
│   │   │   ├── stories.data.ts
│   │   │   ├── stories.logic.ts
│   │   │   └── stories.module.ts
│   │   ├── student
│   │   │   ├── student.data.ts
│   │   │   └── student.module.ts
│   │   ├── teachers
│   │   │   ├── teacher.controller.ts
│   │   │   ├── teacher.data.ts
│   │   │   ├── teacher.logic.ts
│   │   │   └── teacher.module.ts
│   │   ├── testimonials
│   │   │   ├── testimonial.controller.ts
│   │   │   ├── testimonial.data.ts
│   │   │   ├── testimonial.logic.ts
│   │   │   └── testimonial.module.ts
│   │   ├── universities
│   │   │   ├── university
│   │   │   │   ├── university.controller.ts
│   │   │   │   ├── university.data.ts
│   │   │   │   ├── university.logic.ts
│   │   │   │   └── university.module.ts
│   │   │   ├── university2
│   │   │   │   ├── university2.controller.ts
│   │   │   │   ├── university2.data.ts
│   │   │   │   ├── university2.logic.ts
│   │   │   │   └── university2.module.ts
│   │   │   ├── university-course
│   │   │   │   ├── university-course.controller.ts
│   │   │   │   ├── university-course.data.ts
│   │   │   │   ├── university-course.logic.ts
│   │   │   │   └── university-course.module.ts
│   │   │   └── university-course-2
│   │   │       ├── university-course-2.controller.ts
│   │   │       ├── university-course-2.data.ts
│   │   │       ├── university-course-2.logic.ts
│   │   │       └── university-course-2.module.ts
│   │   ├── user
│   │   │   ├── users.controller.ts
│   │   │   ├── users.data.ts
│   │   │   ├── users.logic.ts
│   │   │   └── users.module.ts
│   │   └── user-session
│   │       └── user-session.data.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── common
│   │   ├── classes
│   │   │   ├── error.class.ts
│   │   │   └── exception-filter.class.ts
│   │   ├── constants
│   │   │   ├── auth.constants.ts
│   │   │   ├── course.constants.ts
│   │   │   ├── error.constants.ts
│   │   │   ├── order.constants.ts
│   │   │   ├── payment.constants.ts
│   │   │   ├── recorded-video.constants.ts
│   │   │   ├── student.constants.ts
│   │   │   └── user.constants.ts
│   │   ├── decorators
│   │   │   ├── roles.decorator.ts
│   │   │   └── user.decorator.ts
│   │   ├── guard
│   │   │   ├── roles.guard.ts
│   │   │   └── user.guard.ts
│   │   ├── pipes
│   │   │   └── transform-boolean.pipe.ts
│   │   ├── services
│   │   │   ├── file-uploader.service.ts
│   │   │   ├── image-uploader.service.ts
│   │   │   ├── sendgrid.module.ts
│   │   │   └── sendgrid.service.ts
│   │   ├── types
│   │   │   ├── common.types.ts
│   │   │   └── populated-student.type.ts
│   │   └── utils
│   │       ├── map-to-dto.util.ts
│   │       └── word-count.validator.ts
│   ├── dto
│   │   ├── auth.dto.ts
│   │   ├── batch.dto.ts
│   │   ├── blog.dto.ts
│   │   ├── category.dto.ts
│   │   ├── class-session.dto.ts
│   │   ├── common.dto.ts
│   │   ├── course
│   │   │   ├── batch.dto.ts
│   │   │   ├── chapter.dto.ts
│   │   │   ├── course.dto.ts
│   │   │   └── topic.dto.ts
│   │   ├── demosession.dto.ts
│   │   ├── doubt-session.dto.ts
│   │   ├── enrollment.dto.ts
│   │   ├── home
│   │   │   ├── banner3.dto.ts
│   │   │   ├── banner4.dto.ts
│   │   │   ├── banner.dto.ts
│   │   │   ├── contact-us.dto.ts
│   │   │   ├── faq.dto.ts
│   │   │   ├── hiring-partner.dto.ts
│   │   │   ├── premium-learning-experience.dto.ts
│   │   │   ├── stats.dto.ts
│   │   │   ├── testimonial.dto.ts
│   │   │   └── youtube-video.dto.ts
│   │   ├── index.ts
│   │   ├── language.dto.ts
│   │   ├── order.dto.ts
│   │   ├── recorded-video.dto.ts
│   │   ├── registration.dto.ts
│   │   ├── stories.dto.ts
│   │   ├── teacher.dto.ts
│   │   ├── universities
│   │   │   ├── university2.dto.ts
│   │   │   ├── university-course-2.dto.ts
│   │   │   ├── university-course.dto.ts
│   │   │   └── university.dto.ts
│   │   └── user.dto.ts
│   ├── main.ts
│   └── schemas
│       ├── blog.schema.ts
│       ├── category.schema.ts
│       ├── class-session.schema.ts
│       ├── common.schema.ts
│       ├── course
│       │   ├── batch.schema.ts
│       │   ├── chapter.schema.ts
│       │   ├── course.schema.ts
│       │   └── topic.schema.ts
│       ├── demosession.schema.ts
│       ├── doubt-session.schema.ts
│       ├── enrollment.schema.ts
│       ├── home
│       │   ├── banner3.schema.ts
│       │   ├── banner4.schema.ts
│       │   ├── banner.schema.ts
│       │   ├── contact-us.schema.ts
│       │   ├── faq.schema.ts
│       │   ├── hiring-partner.schema.ts
│       │   ├── premium-learning-experience.schema.ts
│       │   ├── stats.schema.ts
│       │   ├── testimonial.schema.ts
│       │   └── youtube-video.schema.ts
│       ├── language.schema.ts
│       ├── login-attempt.schema.ts
│       ├── order.schema.ts
│       ├── payment.schema.ts
│       ├── recorded-video.schema.ts
│       ├── stories.schema.ts
│       ├── student.schema.ts
│       ├── study_materials.schema.ts
│       ├── teacher.schema.ts
│       ├── universities
│       │   ├── university2.schema.ts
│       │   ├── university.chapter.schema.ts
│       │   ├── university-course-2.schema.ts
│       │   ├── university-course.schema.ts
│       │   ├── university.module.schema.ts
│       │   └── university.schema.ts
│       ├── user.schema.ts
│       ├── user-session.schema.ts
│       └── videos.schema.ts
├── test
│   ├── app.e2e-spec.ts
│   ├── enrollment
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json

64 directories, 255 files