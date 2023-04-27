<template>
    <v-main class="container">
        <div>
            <v-card class="pa-8 gym-bg" width="1700">
                <h1 class="text-h3 text-center white--text font-weight-bold">Welcome, {{ nama }} </h1>
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
        <v-data-table :headers="headers" :items="dataMember" :search="search">
            <template v-slot:item="{ item }">
                <tr @click="dialogProcess(item.ID_MEMBER); formProcess(item);">
                    <td>{{ item.NAMA_MEMBER }}</td>
                    <td>{{ item.ALAMAT_MEMBER }}</td>
                    <td>{{ item.TELEPON_MEMBER}}</td>
                    <td>{{ item.JUMLAH_DEPOSIT_UANG}}</td>
                    <td>{{ item.EMAIL }}</td>
                    <td>{{ item.STATUS == 1 ? 'Aktif' : 'Tidak Aktif'}}</td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model=" dialog " max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>What Action You Wanna Choose</v-toolbar>
                </v-card-title>
                <v-spacer style="height: 10px;"></v-spacer>
                <v-btn color="red" text @click=" dialogDelete = true " style="align-items: center;">Delete</v-btn>
                <v-btn color="blue" text @click=" updateFuntion " class="button">Edit</v-btn>
                <v-btn color="green" text @click=" showMemberCard " class="button">Card</v-btn>
                <v-btn color="orange" text @click=" resetPassword " class="button">Reset</v-btn>
                <v-spacer style="height: 10px;"></v-spacer>
            </v-card>
            <v-dialog v-model=" dialogDelete " persistent max-width="600px" style="z-index: 1000;">
                <v-card>
                    <v-card-title class="text-h5 red lighten-2">
                        <v-toolbar color="red" dark>Are You Sure To Delete This Member?</v-toolbar>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" text @click=" dialogDelete = false ">NO</v-btn>
                        <v-btn color="red" text @click=" deleteProcces ">YES</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-dialog>

        <v-dialog v-model=" dialogAddEdit " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark v-show=" updateTitle ">Edit Member</v-toolbar>
                    <v-toolbar color="red" dark v-show=" addTitle ">Add Member</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model=" formMember.NAMA_MEMBER " label="Member Name" required></v-text-field>
                        <v-text-field v-model=" formMember.ALAMAT_MEMBER " label="Address" required></v-text-field>
                        <v-text-field v-model=" formMember.TELEPON_MEMBER " label="Phone Number" required
                            type="number"></v-text-field>
                        <v-text-field v-model=" formMember.EMAIL " label="Email" required type="email"></v-text-field>
                        <v-dialog v-model=" modal " persistent width="290px">
                            <template v-slot:activator=" { on } ">
                                <v-text-field v-model=" formMember.TANGGAL_LAHIR " label="Birth Date"
                                    prepend-icon="mdi-calendar" v-on=" on " required></v-text-field>
                            </template>
                            <v-date-picker v-model=" formMember.TANGGAL_LAHIR " scrollable required>
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
import store from '@/store/index';
import axios from 'axios';
import toastr from 'toastr';
import router from '@/router';
export default {
    data() {
        return {
            nama: store.state.dataUser.data.NAMA_PEGAWAI,
            headers: [
                { text: 'Nama', value: 'NAMA_MEMBER' },
                { text: 'Alamat', value: 'ALAMAT_MEMBER' },
                { text: 'No. Telp', value: 'TELEPON_MEMBER' },
                { text: 'Jumlah Deposit', value: 'JUMLAH_DEPOSIT_UANG' },
                { text: 'Email', value: 'EMAIL' },
                { text: 'Status', value: 'STATUS' }
            ],
            dataMember: store.state.dataMember.data,
            search: '',
            dialog: false,
            formMember: {
                NAMA_MEMBER: '',
                ALAMAT_MEMBER: '',
                TELEPON_MEMBER: '',
                EMAIL: '',
                TANGGAL_LAHIR: '',
            },
            id: null,
            dialogDelete: false,
            dialogAddEdit: false,
            updateTitle: false,
            addTitle: false,
            updateButton: false,
            addShow: false,
            modal: false,
        }
    },
    async mounted() {
        setInterval(async () => {
            const up = await axios.get(store.state.domainName + 'member')
            store.commit('setDataMember', up.data)
        }, 10000);
    },
    methods: {
        dialogProcess(id) {
            this.dialog = true
            this.id = id
            console.log(id)
        },
        formProcess(item) {
            this.formMember.NAMA_MEMBER = item.NAMA_MEMBER
            this.formMember.ALAMAT_MEMBER = item.ALAMAT_MEMBER
            this.formMember.TELEPON_MEMBER = item.TELEPON_MEMBER
            this.formMember.EMAIL = item.EMAIL
            this.formMember.TANGGAL_LAHIR = item.TANGGAL_LAHIR
        },
        showMemberCard() {
            window.open(store.state.domainName + 'cetak-member-card/' + this.id)
        },
        resetPassword() {
            axios.post(store.state.domainName + 'reset-password/' + this.id)
            toastr.success(this.formMember.NAMA_MEMBER + ' Password has been reset')
        },
        async deleteProcces() {
            const up = await axios.delete(store.state.domainName + 'member/' + this.id)
                .then(async () => {
                    toastr.success(this.formMember.NAMA_MEMBER + ' has been deleted')
                    this.dialogDelete = false
                    const data = await axios.get(store.state.domainName + 'member')
                    store.commit('setDataMember', data.data)
                    router.go()
                }).catch(() => {
                    toastr.error('Failed to delete ' + this.formMember.NAMA_MEMBER)
                })
        },
        clearForm() {
            this.formMember.NAMA_MEMBER = ''
            this.formMember.ALAMAT_MEMBER = ''
            this.formMember.TELEPON_MEMBER = ''
            this.formMember.EMAIL = ''
            this.formMember.TANGGAL_LAHIR = ''
        },
        addFuntion() {
            this.clearForm()
            this.dialogAddEdit = true
            this.addTitle = true
            this.addShow = true
            this.updateButton = false
            this.updateTitle = false
        },
        cancelAddEdit() {
            this.dialogAddEdit = false
            this.addTitle = false
            this.addShow = false
            this.updateButton = false
            this.updateTitle = false
        },
        async addProcess() {
            if (this.formMember.NAMA_MEMBER == '' || this.formMember.ALAMAT_MEMBER == '' || this.formMember.TELEPON_MEMBER == '' || this.formMember.EMAIL == '' || this.formMember.TANGGAL_LAHIR == '') {
                toastr.error('Please fill all the form')
            }
            else if (this.formMember.TELEPON_MEMBER.length < 11 || this.formMember.TELEPON_MEMBER.length > 13) {
                toastr.error('Phone number must between 11 and 13 character')
            }
            else if (this.formMember.EMAIL.includes('@') == false) {
                toastr.error('Email must be valid')
            }
            else {
                const upData = {
                    nama_member: this.formMember.NAMA_MEMBER,
                    alamat_member: this.formMember.ALAMAT_MEMBER,
                    telepon_member: this.formMember.TELEPON_MEMBER,
                    email: this.formMember.EMAIL,
                    tanggal_lahir: this.formMember.TANGGAL_LAHIR,
                }
                const up = await axios.post(store.state.domainName + 'member', upData)
                    .then(async () => {
                        toastr.success(this.formMember.NAMA_MEMBER + ' has been added')
                        const data = await axios.get(store.state.domainName + 'member')
                        this.dialogAddEdit = false
                        this.addTitle = false
                        this.addShow = false
                        this.updateButton = false
                        this.updateTitle = false
                        store.commit('setDataMember', data.data)
                        router.go()
                    }).catch((err) => {
                        toastr.error('Failed to add ' + this.formMember.NAMA_MEMBER)
                        console.log(err)
                    })
            }
        },
        updateFuntion(){
            this.dialogAddEdit = true
            this.addTitle = false
            this.addShow = false
            this.updateButton = true
            this.updateTitle = true
        },
        async updateProcess(){
            if (this.formMember.NAMA_MEMBER == '' || this.formMember.ALAMAT_MEMBER == '' || this.formMember.TELEPON_MEMBER == '' || this.formMember.EMAIL == '' || this.formMember.TANGGAL_LAHIR == '') {
                toastr.error('Please fill all the form')
            }
            else if (this.formMember.TELEPON_MEMBER.length < 11 || this.formMember.TELEPON_MEMBER.length > 13) {
                toastr.error('Phone number must between 11 and 13 character')
            }
            else if (this.formMember.EMAIL.includes('@') == false) {
                toastr.error('Email must be valid')
            }
            else {
                const upData = {
                    nama_member: this.formMember.NAMA_MEMBER,
                    alamat_member: this.formMember.ALAMAT_MEMBER,
                    telepon_member: this.formMember.TELEPON_MEMBER,
                    email: this.formMember.EMAIL,
                    tanggal_lahir: this.formMember.TANGGAL_LAHIR,
                }
                const up = await axios.put(store.state.domainName + 'member/' + this.id, upData)
                    .then(async () => {
                        toastr.success(this.formMember.NAMA_MEMBER + ' has been updated')
                        const data = await axios.get(store.state.domainName + 'member')
                        this.dialogAddEdit = false
                        this.addTitle = false
                        this.addShow = false
                        this.updateButton = false
                        this.updateTitle = false
                        store.commit('setDataMember', data.data)
                        router.go()
                    }).catch((err) => {
                        toastr.error('Failed to update ' + this.formMember.NAMA_MEMBER)
                        console.log(err)
                    })
            }
        }
    }
}
</script>

<style>
.gym-bg {
    background-image: url('@/assets/1087580.jpg');
    background-position: center;
    background-size: cover;
    width: 100%;
}

.container {
    align-items: center;
}

.images {
    background-image: url('@/assets/1633729.jpg');
    background-position: center;
    background-size: cover;
    width: 100%;
}

p {
    text-align: left;
}

td {
    text-align: left;
}
</style>
