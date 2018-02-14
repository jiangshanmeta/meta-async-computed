<template>
    <section>
        <table>
            <tr>
                <th>id</th>
                <td>{{id}}</td>
            </tr>
            <tr>
                <th>userName</th>
                <td>{{userName}}</td>
            </tr>
            <tr>
                <th>userPhone</th>
                <td>{{userPhone}}</td>
            </tr>
            <tr>
                <th>userMail</th>
                <td>{{userMail}}</td>
            </tr>
            <tr>
                <th>userInfo</th>
                <td>{{userInfo}}</td>
            </tr>
        </table>

        <button @click="increaseId">increase id</button>
    </section>
</template>

<script>
export default{
    data(){
        return {
            id:null,
            counter:0,
        };
    },
    computed:{
        userInfo:{
            get(){
                return `${this.userName} || ${this.userMail}`
            },
            cache:false,
        }
    },
    asyncComputed:{
        userName(){
            return new Promise((resolve)=>{
                let id = this.id;

                setTimeout(()=>{
                    resolve(`name for ${id}`);
                },2000);
            });
        },
        userPhone:{
            get(){
                return new Promise((resolve)=>{
                    let id = this.id;
                    setTimeout(()=>{
                        resolve(`phone for ${id}`);
                    },2000)
                })
            },
            default:"loading phone ~~~"
        },
        userMail:{
            get(){
                return new Promise((resolve)=>{
                    let id = this.id;
                    setTimeout(()=>{
                        resolve(`mail for ${id} and counter is ${this.counter}`)
                    },2000);
                })
            },
            watch(){
                return this.counter;
            },
            default(){
                return `loading mail for ${this.id} with counter is ${this.counter}`
            },
        }

    },
    methods:{
        increaseId(){
            this.id++;
        },
    },
    created(){
        this.id = 1;
        setInterval(()=>{
            this.counter++;
        },5000)
    }
}
</script>