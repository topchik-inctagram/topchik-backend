export class CreateUserEvent {
  constructor(
    public readonly nickname: string,
    public readonly code: string,
    public readonly email: string,
  ) {}
}
