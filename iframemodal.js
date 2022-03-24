Vue.component('iframemodal', {
  props: { iframeheight: {default:690} // pixels
           ,iframewidth: {default:1600}
           ,srcurl: {type:String} 
           ,iframeid: {type:String,default:'modalIframeId'}
           //,autoresizetocontent: {type:Boolean,default:false}
           ,headertitle: {type:String,default:'Data'}
           ,bottompad:{default:80}
           ,rightpad:{default:40}
           ,iframezoom:{default:1.0}
           ,xincspan:{default:300}
           ,yincspan:{default:500}
         }
  ,data: function() { 
    return { dFrameZoom:this.iframezoom
         ,dFrameZoomInp:Math.abs(this.iframezoom) // input widget variable
         ,zmFactor:1.10
         ,dPaddingY:Math.floor(this.bottompad) 
         ,dPaddingX:Math.floor(this.rightpad)
         ,dFrameSrc:this.srcurl
         ,dFrameHeight:Math.floor(this.iframeheight)
         ,dFrameWidth:Math.floor(this.iframewidth) 
         ,dFrameHeightOffset:Math.floor(0.25 *this.xincspan)
         ,dFrameHeightOffsetInp:Math.floor(0.25 *this.xincspan)
         ,dFrameWidthOffset:Math.floor(-0.75 * this.xincspan)
         ,dFrameWidthOffsetInp:Math.floor(-0.75 *this.xincspan) 
         ,cntDocObj:{}
         ,cntWinObj:{}
         ,sXMin:(-1 * this.xincspan) 
         ,sXMax:(1 * this.xincspan) 
         ,sYMin:(-1 * this.yincspan)
         ,sYMax:(1 * this.yincspan)
         ,xmaxspan:Math.floor(1.5 * this.xincspan)
         ,ymaxspan:Math.floor(1.5 * this.yincspan)
         ,thisOrange:'#ED821F'
         ,otherOrange:'rgba(237,130,31,0.8)'
       }; 
  }         
  ,computed: { dFrameZoom2: function() {

      //return (this.dFrameZoom * this.dFrameZoom);
      return (this.dFrameZoom * 1.0);
    }
    ,iFrameStyle: function () {
      var rS = { width:this.dFrameWidthPx,
          height:this.dFrameHeightPx,
          transform: 'scale('+this.dFrameZoom+')',
          transformOrigin: '0 0'
     };
     return rS;
   }
   ,dFrameWidthPx: function() {
     return ((this.dFrameWidth) + 'px');
   }
   ,dFrameHeightPx: function() { 
     return ((this.dFrameHeight) + 'px');
   }
   ,dContWidth: function() {
     return Math.round(this.dFrameWidth * this.dFrameZoom2 + this.dPaddingX * 1.0);
   }
   ,dContHeight: function() {
     return Math.round(this.dFrameHeight * this.dFrameZoom2 + this.dPaddingY * 1.0);
   }
   ,dContWidthPx: function() {
     return ((this.dContWidth) + 'px');
   }
   ,dContHeightPx: function() {
     return ((this.dContHeight) + 'px');
   }
   ,modalMaskStyle: function() {
     return {
        position: 'fixed',
        zIndex: 9998,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        display: 'table',
        transition: 'opacity .3s ease'
     }
   }
   ,modalWrapperStyle: function() {
     return {
       display: 'table-cell',
       verticalAlign: 'middle'
       
     }
   }
   ,modalBodyStyle: function() {
     return {
       margin: '20px 0'
     }
   }
   ,modalHeaderStyle: function() {
     return { maxWidth:'1400px',
        display: 'flex', 
       justifyContent:'space-between',
       alignItems:'center',
       color: 'darkgray'
     }
   }
   ,modalContainerStyle: function() {
     return {
          height:this.dContHeightPx,
          width:this.dContWidthPx,
          margin: '0px auto',
          padding: '20px 30px',
          backgroundColor: '#fff',
          borderRadius: '2px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, .33)',
          transition: 'all .3s ease',
          fontFamily: 'Helvetica, Arial, sans-serif'
        }

   }
   ,zmbStyle: function() {
     return {
       color:'dodgerblue'
     }
   }
   ,htbStyle: function() {
     return {
       color:this.thisOrange
     }
   }
   ,modalCloseStyle: function() {
     return {
       fontSize:'3em'
      ,fontWeight:'bold'
      ,verticalAlign:'center'
      ,color:this.thisOrange
     }
   }
   ,sliderXMin: function() {
     return Math.round(this.sXMin / 10) * 10;
   }
   ,sliderYMin: function() {
     return Math.round(this.sYMin / 10) * 10;
   }
   ,sliderXMax: function() {
     return Math.round(this.sXMax / 10) * 10;
   }
   ,sliderYMax: function() {
     return Math.round(this.sYMax / 10) * 10;
   }
     ,zoomText: function() {
       return (Math.round(this.dFrameZoomInp * 100) / 100.0);
     }

     

  }
  ,methods: {
    adjustHt: function() {
      this.chk4snapHt();
      this.dFrameHeight = Math.round((this.iframeheight + this.dFrameHeightOffset * 1.0) / (this.dFrameZoom2) ) ;    
    }
    ,adjustWd: function() {
      this.chk4snapWd();
       this.dFrameWidth = Math.round((this.iframewidth + this.dFrameWidthOffset * 1.0) / (this.dFrameZoom2)); 
    }
    ,setZoomByWheel:function(e) {
          if (e.deltaY < 0) 
          { this.dFrameZoomInp = Math.abs(this.dFrameZoomInp) + 0.05; 
            this.chk4snapZ(); this.setDZoom();
          } 
          else if (e.deltaY > 0)  
          { this.dFrameZoomInp = Math.abs(this.dFrameZoomInp) - 0.05; 
            this.chk4snapZ(); this.setDZoom();
          } 
       
    }
    ,spanHtByWheel:function(e) { //var beta = 1.1; 
          //var cX = this.cursorX;
          //var cY = this.cursorY;
          //var gs = this.vScale;
          if (e.deltaY < 0) 
          { if (this.sYMax < (1 * this.ymaxspan)) this.sYMax *= 1.5;
            if (this.sYMin > (-1 * this.ymaxspan)) this.sYMin *= 1.5;
          } 
          else if (e.deltaY > 0)  
          { if (Math.abs(this.sYMax) > 40) this.sYMax /= 1.5;
            if (Math.abs(this.sYMin) > 40) this.sYMin /= 1.5;
          } 
          
          
            this.adjustHt();
           
        }
    ,spanWdByWheel:function(e) { //var beta = 1.1; 
          //var cX = this.cursorX;
          //var cY = this.cursorY;
          //var gs = this.vScale;
           if (e.deltaY < 0) 
          { if (this.sXMax < (1 * this.xmaxspan)) this.sXMax *= 1.5;
            if (this.sXMin > (-1 * this.xmaxspan)) this.sXMin *= 1.5;
          } 
          else if (e.deltaY > 0)  
          { if (Math.abs(this.sXMax) > 40) this.sXMax /= 1.5;
            if (Math.abs(this.sXMin) > 40) this.sXMin /= 1.5;
          }
          
          
            this.adjustWd();
            
        }
     ,currentHtText: function(preamble) {
       return preamble + ' - use mouse wheel to change range';
     }
     ,currentWdText: function(preamble) {
       return preamble + ' - use mouse wheel to change range';
     }
     ,currentZoomText: function(preamble) {
       return preamble + ' - change by wheel';
     }
     ,chk4snapZ: function() {
        if (Math.abs(this.dFrameZoomInp-1.0) < 0.05) this.dFrameZoomInp = 1.0;
     }
     ,chk4snapHt: function() {
        if (Math.abs(this.dFrameHeightOffsetInp) < 40) this.dFrameHeightOffsetInp = 0;
        if (this.dFrameHeightOffsetInp > this.sliderYMax) {this.dFrameHeightOffsetInp = this.sliderYMax;this.setDHt();}; 
        if (this.dFrameHeightOffsetInp < this.sliderYMin) {this.dFrameHeightOffsetInp = this.sliderYMin;this.setDHt();}; 
     }
     ,chk4snapWd: function() {
        if (Math.abs(this.dFrameWidthOffsetInp) < 20) this.dFrameWidthOffsetInp = 0;
        if (this.dFrameWidthOffsetInp > this.sliderXMax) {this.dFrameWidthOffsetInp = this.sliderXMax;this.setDWd();}; 
        if (this.dFrameWidthOffsetInp < this.sliderXMin) {this.dFrameWidthOffsetInp = this.sliderXMin;this.setDWd();}; 
     }
     ,setDZoom: function() {
       this.dFrameZoom = this.dFrameZoomInp;
       this.adjustHt();
       this.adjustWd();
       //this.spanHtByZoom(); 
       //this.spanWdByZoom(); 
     }
     ,setDWd: function() {
       this.dFrameWidthOffset = this.dFrameWidthOffsetInp;
       this.adjustWd();
     }
     ,setDHt: function() {
       this.dFrameHeightOffset = this.dFrameHeightOffsetInp;
       this.adjustHt();
     }


  }
  ,mounted: function() {
     console.log(this.sYMax);
  }
  ,created: function() {
     this.adjustWd();
     this.adjustHt();
  }
  ,template: `
    <div :style="modalMaskStyle">
      <div :style="modalWrapperStyle">
        <div :style="modalContainerStyle">
          <div :style="modalHeaderStyle">
             <aside style="display:flex;flex-direction:column;align-items:center" @wheel.prevent="setZoomByWheel($event)">
               Zoom {{zoomText}}
               <br>
               <input type="range" min="0.4" max="1.2" step="0.01" 
               v-model="dFrameZoomInp" @change="setDZoom()" :title="currentZoomText('Zoom')"
                
               @input="chk4snapZ()"/>
             </aside>
              
              
                <aside style="display:flex;flex-direction:column;align-items:center" @wheel.prevent="spanHtByWheel($event)">
                Height Offset {{dFrameHeightOffsetInp}} ({{sliderYMin}} to {{sliderYMax}})
               <br>
                <input type="range" :min="sliderYMin" :max="sliderYMax"  
                  @input="chk4snapHt()"
                  v-model="dFrameHeightOffsetInp"  @change="setDHt()" 
                  :title="currentHtText('Adjust Frame Height')" 
                   />
                
                </aside>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <a target="_blank" :href="dFrameSrc" title="Launch in New Tab"><b>{{headertitle}}</b></a>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
                <aside style="display:flex;flex-direction:column;align-items:center" @wheel.prevent="spanWdByWheel($event)">
                Width Offset {{dFrameWidthOffsetInp}} ({{sliderXMin}} to {{sliderXMax}})
               <br>
                <input type="range" :min="sliderXMin" :max="sliderXMax" 
                 @input="chk4snapWd()"
                v-model="dFrameWidthOffsetInp"  @change="setDWd()" 
                :title="currentWdText('Adjust Frame Width')" 
                 />
                </aside>
               <div>&nbsp;</div>
              <div><b :style="modalCloseStyle" @click="$emit('close')">&#x2612;</b></div>
              
             
            
          </div>
          <div :style="modalBodyStyle">
            <iframe :id="iframeid" :src="dFrameSrc" :style="iFrameStyle" :content-document="cntDocObj" :content-window="cntWinObj" :title="headertitle"></iframe>
          </div>
        </div>
      </div>
    </div>
  `
});
