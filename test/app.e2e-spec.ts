import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { edithUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'email@email.com',
      password: 'jayvee',
    };
    describe('Signup', () => {
      it('should throw an error if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw an error if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw an error if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw an error if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw an error if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw an error if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get the current user', () => {
        return pactum.spec().get('/user/me').expectStatus(200).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        });
      });
    });
    describe('Edit User', () => {
      const dto: edithUserDto = {
        firstName: 'Jayvee',
        email: 'jayvee@email.com',
      };
      it('Should edit user', () => {
        return pactum
          .spec()
          .patch('/user')
          .expectStatus(200)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName);
      });
    });
  });
  describe('Bookmark', () => {
    const dto: CreateBookmarkDto = {
      title: 'JayveeScript',
      link: 'jayveescript.com',
    };
    describe('Get empty bookmarks', () => {
      it('Should get booksmark', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .expectStatus(200)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectBody([]);
      });
    });
    describe('Create bookmarks', () => {
      it('Should create booksmark', () => {
        return pactum
          .spec()
          .post('/bookmark')
          .expectStatus(201)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get bookmark', () => {
      it('Should get booksmark', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .expectStatus(200)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectJsonLength(1);
      });
    });
    describe('Get bookmark by id', () => {
      it('Should get booksmark by Id', () => {
        return pactum
          .spec()
          .get('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectBodyContains('$S{bookmarkId}');
      });
    });
    describe('Edith bookmark', () => {
      const dto: EditBookmarkDto = {
        description: 'new description',
      };
      it('Should edit booksmark ', () => {
        return pactum
          .spec()
          .patch('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .expectStatus(200)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectBodyContains(dto.description);
      });
    });
    describe('Delete Bookmark', () => {
      it('Should delete booksmark ', () => {
        return pactum
          .spec()
          .delete('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')

          .expectStatus(204)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          });
      });

      it('Should get empty booksmark', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .expectStatus(200)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectJsonLength(0);
      });
    });
  });
});
