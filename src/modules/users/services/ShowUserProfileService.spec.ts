import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowUserProfileService from './ShowUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showUserProfileService: ShowUserProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showUserProfileService = new ShowUserProfileService(fakeUsersRepository);
  });

  it('should be able to show profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'JD',
      email: 'jd@jd.com',
      password: '123456',
    });

    const profile = await showUserProfileService.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('JD');
    expect(profile.email).toBe('jd@jd.com');
  });

  it('should not be able to show profile of non-existing user', async () => {
    await expect(
      showUserProfileService.execute({
        user_id: 'meh',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
