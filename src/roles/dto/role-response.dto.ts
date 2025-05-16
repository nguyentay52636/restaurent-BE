import { PermissionResponseDto } from 'src/permissions/dto/permission-response.dto';

export class RoleResponseDto {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: PermissionResponseDto[];
}
