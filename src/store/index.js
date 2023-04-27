import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        domainName: 'http://127.0.0.1:8000/api/',
        dataUser: null,
        loginInfo: null,
        dataPromo: null,
        dataPegawai: null,
        dataInstruktur: null,
        dataMember: null,
        dataKelas: null,
    },
    mutations: {
        setDataUser(state, payload) {
            state.dataUser = payload;
        },
        setLoginInfo(state, payload) {
            state.loginInfo = payload;
        },
        setDataPromo(state, payload) {
            state.dataPromo = payload;
        },
        setDataPegawai(state, payload) {
            state.dataPegawai = payload;
        },
        setDataInstruktur(state, payload) {
            state.dataInstruktur = payload;
        },
        setDataMember(state, payload) {
            state.dataMember = payload;
        },
        setDataKelas(state, payload) {
            state.dataKelas = payload;
        }
    },
    actions: {
        // actions
    },
    getters: {
        //ambil data domainName dari state
    },
    plugins: [createPersistedState()],
})

export default store
