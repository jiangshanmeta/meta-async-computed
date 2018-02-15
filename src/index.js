function _genDefault(defaultVal,vm){
    return typeof defaultVal === 'function'?defaultVal.call(vm):defaultVal;
}

function defineAsyncComputed(vm,key,userDef){
    let getter;
    let defaultVal = null;
    let lazy = false;
    let watch;
    
    if(typeof userDef === 'function'){
        getter = userDef;
    }else{
        getter = userDef.get;
        if(userDef.hasOwnProperty('default')){
            defaultVal = userDef.default;
        }
        if(typeof userDef.watch === 'function'){
            watch = userDef.watch;
        }
    }

    let val = _genDefault(defaultVal,vm);

    Object.defineProperty(vm,key,{
        get(){
            return val;
        },
    });

    vm.$watch(function(){
        watch && watch.call(this);
        val = _genDefault(defaultVal,vm);
        vm.$forceUpdate();
        return getter.call(this);
    },function(promise){

        if(!(promise instanceof Promise)){
            promise = Promise.resolve(promise);
        }

        promise.then((newVal)=>{
            val = newVal;
            vm.$forceUpdate();
        });


    },{
        lazy
    })

}


export default {
    install(Vue){
        // 合并策略设置，与computed一样 尽可能保留重复的后面的覆盖前面的
        Vue.config.optionMergeStrategies.asyncComputed = Vue.config.optionMergeStrategies.computed;
        
        Vue.mixin({
            created(){
                const asyncComputed = this.$options.asyncComputed;
                if(!asyncComputed || typeof asyncComputed !== 'object'){
                    return;
                }

                Object.keys(asyncComputed).forEach((key)=>{
                    defineAsyncComputed(this,key,asyncComputed[key])
                })

            }
        })
    }
}