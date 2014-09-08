var increment=(
        function(){
            var id=0;
            return function(){
                return ++id;
            }
        }
        )()
 alert(increment());
 alert(increment());

