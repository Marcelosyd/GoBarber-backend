import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const userLogged = await fakeUsersRepository.create({
      name: 'JD',
      email: 'jd@jd.com',
      password: '123456',
    });

    const user1 = await fakeUsersRepository.create({
      name: 'JD1',
      email: 'jd1@jd.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'JD2',
      email: 'jd2@jd.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: userLogged.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
