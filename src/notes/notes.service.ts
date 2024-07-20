import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note-dto';
import {v4 as uuid4 } from "uuid"
import { UpdateNoteDto } from './dto/update-note-dto';


@Injectable()
export class NotesService {
    private notes = [
        {
            id: "54",
            title: "<h2>Test note</h2>",
            content:"<p>upa lupa go</p>"
        },
        {
            id: "55",
            title: "<h2>Ronald Trump</h2>",
            content:"<p>upa lupa go</p>"
        }
    ];

    getNotes(){
 return this.notes
    };

    getNote(id: string){
const note = this.notes.find(item => item.id === id)
if(!note){
    throw new Error("note not found")
}
return note
    };
    createNote(creatNotesDto:CreateNoteDto){
       const note = {
        ...creatNotesDto,
        id: uuid4()
       }
        this.notes.push(note)
    };
    updateNote(id:string, updateNoteDto:UpdateNoteDto){
        this.notes = this.notes.map(note => {
            if(note.id === id){
             return({
                ...note,
                ...updateNoteDto
             })
            };
            return note
        });
        return this.getNote(id)
    };
    removeNote(id:string){
        const noteToBeRemoved = this.getNote(id)
        this.notes = this.notes.filter(item => item.id === id);
        return noteToBeRemoved;
    }
}
