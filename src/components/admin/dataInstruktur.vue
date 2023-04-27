<template>
    <v-main class="container">
        <div>
            <v-card class="pa-8 gym-bg" width="1700">
                <h1 class="text-h3 text-center white--text font-weight-bold">Data of Instruktur</h1>
            </v-card>
            <v-spacer style="height: 30px;"></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide details></v-text-field>
            <v-btn class="mx-2" fab dark color="indigo" @click="addFuntion">
                <v-icon dark>
                    mdi-account-plus
                </v-icon>
            </v-btn>
            <v-spacer style="height: 20px;"></v-spacer>
            <v-data-table :headers="headers" :items="dataInstruktur" :search="search">
                <template v-slot:item="{ item }">
                    <tr @click="dialogProcess(item.ID_INSTRUKTUR); formProcess(item);">
                        <td>{{ item.USERNAME_INSTRUKTUR }}</td>
                        <td>{{ item.NAMA_INSTRUKTUR }}</td>
                        <td>{{ item.TELEPON_INSTRUKTUR}}</td>
                        <td>{{ item.ALAMAT_INSTRUKTUR}}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <v-dialog v-model=" dialog " max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>What Action You Wanna Choose</v-toolbar>
                </v-card-title>
                <v-spacer style="height: 10px;"></v-spacer>
                <v-btn color="red" text @click=" dialogDelete = true " style="align-items: center;">Delete</v-btn>
                <v-btn color="blue" text @click=" updateFuntion " class="button">Edit</v-btn>
                <v-spacer style="height: 10px;"></v-spacer>
            </v-card>
        </v-dialog>
        <v-dialog v-model=" dialogDelete " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Are You Sure To Delete This Instruktur?</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" dialogDelete = false ">NO</v-btn>
                    <v-btn color="red" text @click=" deleteProcces ">YES</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model=" dialogAddEdit " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark v-show=" updateTitle ">Edit Instruktur</v-toolbar>
                    <v-toolbar color="red" dark v-show=" addTitle ">Add Instruktur</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model=" formInstruktur.namaistruktur " label="Instruktur Name"
                            required></v-text-field>
                        <v-text-field v-model=" formInstruktur.alamatinstruktur " label="Address" required></v-text-field>
                        <v-text-field v-model=" formInstruktur.telponstruktur " label="Phone Number" required
                            type="number"></v-text-field>
                        <v-dialog v-model=" modal " persistent width="290px">
                            <template v-slot:activator=" { on } ">
                                <v-text-field v-model=" formInstruktur.tanggal_lahir " label="Birth Date"
                                    prepend-icon="mdi-calendar" v-on=" on " required></v-text-field>
                            </template>
                            <v-date-picker v-model=" formInstruktur.tanggal_lahir " scrollable required>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click=" modal = false ">
                                    Cancel
                                </v-btn>
                                <v-btn text color="primary" @click=" modal = false ">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" cancelAddEdit ">Cancel</v-btn>
                    <v-btn color="blue" text @click=" updateProcess " v-show=" updateButton ">Save</v-btn>
                    <v-btn color="blue" text @click=" addProcess " v-show=" addShow ">Save</v-btn>
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
import { onMounted } from 'vue'
export default {
    data: () => ({
        headers: [
            { text: 'Username', value: 'USERNAME_INSTRUKTUR' },
            { text: 'Nama Instruktur', value: 'NAMA_INSTRUKTUR' },
            { text: 'No Telepon', value: 'TELEPON_INSTRUKTUR' },
            { text: 'Alamat', value: 'ALAMAT_INSTRUKTUR' },
        ],
        dataInstruktur: store.state.dataInstruktur.data,
        search: '',
        id: '',
        formInstruktur: {
            namaistruktur: '',
            telponstruktur: '',
            alamatinstruktur: '',
            tanggal_lahir: '',
        },
        dialog: false,
        dialogDelete: false,
        updateTitle: false,
        addTitle: false,
        dialogAddEdit: false,
        updateButton: false,
        addShow: false,
        modal: false,
    }),
    mounted() {
        setInterval(async () => {
            const up = await axios.get(store.state.domainName + 'instruktur')
            store.commit('setDataInstruktur', up.data)
        }, 10000)
    },
    methods: {
        dialogProcess(id) {
            this.dialog = true
            this.id = id
        },
        formProcess(id) {
            this.formInstruktur.namaistruktur = id.NAMA_INSTRUKTUR
            this.formInstruktur.telponstruktur = id.TELEPON_INSTRUKTUR
            this.formInstruktur.alamatinstruktur = id.ALAMAT_INSTRUKTUR
            this.formInstruktur.tanggal_lahir = id.TANGGAL_LAHIR
        },
        async deleteProcces() {
            const up = await axios.delete(store.state.domainName + 'instruktur/' + this.id)
                .then(async () => {
                    const data = await axios.get(store.state.domainName + 'instruktur')
                    store.commit('setDataInstruktur', data.data)
                    toastr.success('instruktur Deleted')
                    router.go()
                }).catch((err) => {
                    toastr.error('Failed to Delete instruktur')
                })
        },
        addFuntion() {
            this.clearFuntion()
            this.dialogAddEdit = true
            this.addTitle = true
            this.updateTitle = false
            this.addShow = true
            this.updateButton = false
        },
        clearFuntion() {
            this.formInstruktur.namaistruktur = ''
            this.formInstruktur.telponstruktur = ''
            this.formInstruktur.alamatinstruktur = ''
            this.formInstruktur.tanggal_lahir = ''
        },
        updateFuntion() {
            this.dialogAddEdit = true
            this.addTitle = false
            this.updateTitle = true
            this.addShow = false
            this.updateButton = true
        },
        cancelAddEdit() {
            this.dialogAddEdit = false
            this.clearFuntion()
        },
        async addProcess() {
            if (this.formInstruktur.namaistruktur == '' || this.formInstruktur.telponstruktur == '' || this.formInstruktur.alamatinstruktur == '' || this.formInstruktur.tanggal_lahir == '') {
                toastr.error('Please fill all the form')
            } else if (this.formInstruktur.telponstruktur.length < 11 || this.formInstruktur.telponstruktur.length > 13) {
                toastr.error('Please fill phone number between 11-13')
            } else {
                const addData = {
                    nama_instruktur: this.formInstruktur.namaistruktur,
                    telepon_instruktur: this.formInstruktur.telponstruktur,
                    alamat_instruktur: this.formInstruktur.alamatinstruktur,
                    tanggal_lahir: this.formInstruktur.tanggal_lahir,
                }
                const up = await axios.post(store.state.domainName + 'instruktur', addData)
                    .then(async () => {
                        const data = await axios.get(store.state.domainName + 'instruktur')
                        store.commit('setDataInstruktur', data.data)
                        toastr.success('instruktur Added')
                        router.go()
                    }).catch((err) => {
                        toastr.error('Failed to Add instruktur')
                        console.log(err)
                    })
            }
        },
        async updateProcess() {
            if (this.formInstruktur.namaistruktur == '' || this.formInstruktur.telponstruktur == '' || this.formInstruktur.alamatinstruktur == '' || this.formInstruktur.tanggal_lahir == '') {
                toastr.error('Please fill all the form')
            } else if (this.formInstruktur.telponstruktur.length < 11 || this.formInstruktur.telponstruktur.length > 13) {
                toastr.error('Please fill phone number between 11-13')
            } else {
                const addData = {
                    nama_instruktur: this.formInstruktur.namaistruktur,
                    telepon_instruktur: this.formInstruktur.telponstruktur,
                    alamat_instruktur: this.formInstruktur.alamatinstruktur,
                    tanggal_lahir: this.formInstruktur.tanggal_lahir,
                }
                const up = await axios.put(store.state.domainName + 'instruktur/' + this.id, addData)
                    .then(async () => {
                        const data = await axios.get(store.state.domainName + 'instruktur')
                        store.commit('setDataInstruktur', data.data)
                        toastr.success('instruktur Updated')
                        router.go()
                    }).catch((err) => {
                        toastr.error('Failed to Update instruktur')
                    })
            }
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


