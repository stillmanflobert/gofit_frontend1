<template>
    <v-main class="container">
        <div>
            <v-card class="pa-8 gym-bg" width="1700">
                <h1 class="text-h3 text-center white--text font-weight-bold">Data of Pegawai</h1>
            </v-card>
        </div>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide details></v-text-field>
        <v-btn class="mx-2" fab dark color="indigo" @click="addFuntion">
            <v-icon dark>
                mdi-account-plus
            </v-icon>
        </v-btn>
        <v-spacer style="height: 20px;"></v-spacer>
        <v-data-table :headers="headers" :items="dataPegawai" :search="search">
            <template v-slot:item="{ item }">
                <tr @click="dialogProcess(item.ID_PEGAWAI); formProcess(item);">
                    <td>{{ item.ID_PEGAWAI }}</td>
                    <td>{{ item.NAMA_PEGAWAI }}</td>
                    <td>{{ item.ALAMAT }}</td>
                    <td>{{ item.NO_TELP }}</td>
                    <td>{{ item.EMAIL }}</td>
                    <td>{{ item.ROLE }}</td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model="dialog" max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>What Action You Wanna Choose</v-toolbar>
                </v-card-title>
                <v-spacer style="height: 10px;"></v-spacer>
                <v-btn color="red" text @click="deleteFuntion" style="align-items: center;">Delete</v-btn>
                <v-btn color="blue" text @click="updateFuntion" class="button">Edit</v-btn>
                <v-spacer style="height: 10px;"></v-spacer>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Are You Sure To Delete This Pegawai?</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="cancelFunction">NO</v-btn>
                    <v-btn color="red" text @click="deleteProcces">YES</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model="dialogAddEdit" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark v-show="updateTitle">Edit Pegawai</v-toolbar>
                    <v-toolbar color="red" dark v-show="addTitle">Add Pegawai</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model="formAddEdit.nama" label="Pegawai Name" required></v-text-field>
                        <v-text-field v-model="formAddEdit.email" label="Email" required></v-text-field>
                        <v-text-field v-model="formAddEdit.alamat" label="Address" required></v-text-field>
                        <v-text-field v-model="formAddEdit.no_telp" label="Phone Number" required type="number"></v-text-field>
                        <v-select v-model="formAddEdit.role" :items="[ `admin`, `manager operasional`, `kasir`]"
                            label="Role"></v-select>
                        <v-dialog v-model="modal" persistent width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="formAddEdit.tanggal_lahir" label="Birth Date"
                                    prepend-icon="mdi-calendar" v-on="on" required></v-text-field>
                            </template>
                            <v-date-picker v-model="formAddEdit.tanggal_lahir" scrollable required>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">
                                    Cancel
                                </v-btn>
                                <v-btn text color="primary" @click="modal = false">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="cancelAddEdit">Cancel</v-btn>
                    <v-btn color="blue" text @click="updateProcess" v-show="updateButton">Save</v-btn>
                    <v-btn color="blue" text @click="addProcess" v-show="addShow">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>
<script>
import store from '@/store/index'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import router from '@/router'
export default {
    data: () => ({
        loading: false,
        selection: 1,
        dialog: false,
        dialogDelete: false,
        deleteId: null,
        dialogAddEdit: false,
        modal: false,
        updateButton: false,
        addShow: false,
        headers: [
            { text: 'ID Pegawai', value: 'ID_PEGAWAI' },
            { text: 'Nama Pegawai', value: 'NAMA_PEGAWAI' },
            { text: 'Alamat', value: 'ALAMAT' },
            { text: 'No Telepon', value: 'NO_TELP' },
            { text: 'Email', value: 'EMAIL' },
            { text: 'role', value: 'ROLE' },
        ],
        dataPegawai: store.state.dataPegawai.data,
        search: '',
        formAddEdit: {
            nama: '',
            alamat: '',
            no_telp: '',
            email: '',
            role: '',
            tanggal_lahir: '',
        },
        updateTitle: false,
        addTitle: false,
    }),
    mounted() {
        setInterval(async() => {
            const up = await axios.get(store.state.domainName + 'pegawai')
            store.commit('setDataPegawai', up.data)
        }, 10000)
    },
    methods: {
        dialogProcess(id) {
            this.dialog = true
            this.deleteId = id
        },
        cancelFunction() {
            this.dialogDelete = false
            this.deleteId = null
        },
        deleteFuntion() {
            this.dialogDelete = true
        },
        async deleteProcces() {
            if (this.deleteId == store.state.dataUser.data.ID_PEGAWAI) {
                toastr.error('You Cant Delete Your Own Account')
                this.dialogDelete = false
                this.deleteId = null
            } else {
                const deleteData = await axios.delete(store.state.domainName + 'pegawai/' + this.deleteId)
                    .then(async (res) => {
                        toastr.success('Delete Success')
                        this.dialogDelete = false
                        this.dialog = false
                        this.deleteId = null
                        const up = await axios.get(store.state.domainName + 'pegawai')
                        store.commit('setDataPegawai', up.data)
                        router.go()
                    }).catch((err) => {
                        toastr.error('Delete Failed')
                    })
            }
        },
        addFuntion(){
            this.clearForm()
            this.dialogAddEdit = true
            this.addTitle = true
            this.updateTitle = false
            this.addShow = true
            this.updateButton = false
        },
        updateFuntion(){
            if(this.formAddEdit.nama == store.state.dataUser.data.NAMA_PEGAWAI){
                toastr.error('You Cant Update Your Own Account')
                this.dialog = false
            }else{
                this.dialogAddEdit = true
                this.addTitle = false
                this.updateTitle = true
                this.addShow = false
                this.updateButton = true
            }
        },
        cancelAddEdit() {
            this.dialogAddEdit = false
            this.clearForm()
        },
        clearForm(){
            this.formAddEdit.nama = ''
            this.formAddEdit.alamat = ''
            this.formAddEdit.no_telp = ''
            this.formAddEdit.email = ''
            this.formAddEdit.role = ''
            this.formAddEdit.tanggal_lahir = ''
        },
        async addProcess() {
            if (this.formAddEdit.nama == '' || this.formAddEdit.alamat == '' || this.formAddEdit.no_telp == '' || this.formAddEdit.email == '' || this.formAddEdit.role == '' || this.formAddEdit.tanggal_lahir == '') {
                toastr.error('Please Fill All Form')
            }else if(this.formAddEdit.no_telp.length < 11 || this.formAddEdit.no_telp.length > 13){
                toastr.error('Phone Number Must Between 11-13 Character')
            }else if(this.formAddEdit.email.includes('@') == false){
                toastr.error('Email Must Contain @ ')
            }else{
                const data = {
                    nama_pegawai: this.formAddEdit.nama,
                    alamat: this.formAddEdit.alamat,
                    no_telp: this.formAddEdit.no_telp,
                    email: this.formAddEdit.email,
                    role: this.formAddEdit.role,
                    tanggal_lahir: this.formAddEdit.tanggal_lahir,
                }
                const co = await axios.post(store.state.domainName + 'pegawai', data)
                .then(async (res) => {
                    toastr.success('Add Success')
                    this.cancelAddEdit()
                    const up = await axios.get(store.state.domainName + 'pegawai')
                    store.commit('setDataPegawai', up.data)
                    router.go()
                }).catch((err) => {
                    toastr.error('Add Failed')
                    console.log(err)
                })
            }

        },
        updateProcess() {
            if (this.formAddEdit.nama == '' || this.formAddEdit.alamat == '' || this.formAddEdit.no_telp == '' || this.formAddEdit.email == '' || this.formAddEdit.role == '' || this.formAddEdit.tanggal_lahir == '') {
                toastr.error('Please Fill All Form')
            }else if(this.formAddEdit.email.includes('@') == false){
                toastr.error('Email Must Contain @ ')
            }else if(this.formAddEdit.no_telp.length < 11 || this.formAddEdit.no_telp.length > 13){
                toastr.error('Phone Number Must Between 11-13 Character')
            }else{
                const data = {
                    nama_pegawai: this.formAddEdit.nama,
                    alamat: this.formAddEdit.alamat,
                    no_telp: this.formAddEdit.no_telp,
                    email: this.formAddEdit.email,
                    role: this.formAddEdit.role,
                    tanggal_lahir: this.formAddEdit.tanggal_lahir,
                }
                const co = axios.put(store.state.domainName + 'pegawai/' + this.deleteId, data)
                    .then(async (res) => {
                        toastr.success('Update Success')
                        const up = await axios.get(store.state.domainName + 'pegawai')
                        store.commit('setDataPegawai', up.data)
                        router.go()
                    }).catch((err) => {
                        toastr.error('Update Failed')
                    })
            }
        },
        formProcess(item){
                this.formAddEdit.nama = item.NAMA_PEGAWAI
                this.formAddEdit.alamat = item.ALAMAT
                this.formAddEdit.no_telp = item.NO_TELP
                this.formAddEdit.email = item.EMAIL
                this.formAddEdit.role = item.ROLE
                this.formAddEdit.tanggal_lahir = item.TANGGAL_LAHIR
                this.deleteId = item.ID_PEGAWAI
        }
    }
};
</script>
<style scoped>
.text {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.gym-bg {
    background-image: url('@/assets/1087580.jpg');
    background-position: center;
    background-size: cover;
    width: 100%;
}

td {
    text-align: left;
}

.coba {
    align-items: center;
}
</style>


