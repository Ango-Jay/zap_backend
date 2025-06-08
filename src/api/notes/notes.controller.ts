import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note-dto';
import { NotesService } from './notes.service';
import { UpdateNoteDto } from './dto/update-note-dto';
import { UserGuard } from '../../common/guards/user.guard';

@Controller('notes')
@UseGuards(UserGuard)
export class NotesController {
    constructor(private readonly notesService:NotesService){}
    //  GET /notes
@Get()
 getNotes(){
   return this.notesService.getNotes()
}
// GET /note/:id
@Get(":id") 
 getNote(@Param("id") id:string){
try {
    return this.notesService.getNote(id);
} catch (error) {
    throw new NotFoundException()
}
 }
// POST /note
@Post()
 createNote(@Body() createNoteDto:CreateNoteDto){
  return this.notesService.createNote(createNoteDto)
 }
// PATCH /note/:id
@Patch(":id")
 updateNote(@Param("id") id:string, @Body() updateNoteDto:UpdateNoteDto){
    return this.notesService.updateNote(id, updateNoteDto)
 }
// DELETE /note/:id
@Delete(":id")
 removeNote(@Param("id") id:string){
return this.notesService.removeNote(id)
 }
}
