import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'JD',
      email: 'jd@jd.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'JT',
      email: 'jt@jt.com',
    });

    expect(updatedUser.name).toBe('JT');
    expect(updatedUser.email).toBe('jt@jt.com');
  });

  it('should not be able to change the email to a already used email', async () => {
    await fakeUsersRepository.create({
      name: 'JD',
      email: 'jd@jd.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'JD2',
      email: 'jt@jt.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'JT',
        email: 'jd@jd.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'JD',
      email: 'jd@jd.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'JT',
      email: 'jt@jt.com',
      password: '323232',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('323232');
  });

  it('should not be able to update password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'JD',
      email: 'jd@jd.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'JT',
        email: 'jt@jt.com',
        password: '323232',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'JD',
      email: 'jd@jd.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'JT',
        email: 'jt@jt.com',
        old_password: 'wrongoldpass',
        password: '323232',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile of non existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'meh',
        name: 'JT',
        email: 'jt@jt.com',
        old_password: 'wrongoldpass',
        password: '323232',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
