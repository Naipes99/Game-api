import { PartialType } from '@nestjs/mapped-types';
import { CreateGamDto } from './create-gam.dto';

export class UpdateGamDto extends PartialType(CreateGamDto) {}
