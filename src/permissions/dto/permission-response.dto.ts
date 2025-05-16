export class PermissionResponseDto {
  id: number;
  name: string;
  description?: string;
  roles: any[];
  created_at: Date;
  updated_at: Date;
}
