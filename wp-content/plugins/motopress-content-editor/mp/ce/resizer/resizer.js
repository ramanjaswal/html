steal("jquery/class",function($){$.Class("CE.Resizer",{myThis:null},{minHeight:50,spaceMinHeight:10,handle:null,addedStyleProperties:["position","top","left","width","height","background-position","background-repeat"],emptySpan:$("<div />",{"class":"motopress-span motopress-empty"}),splitter:$("<div />",{"class":"motopress-splitter"}),init:function(){CE.Resizer.myThis=this;$(window).on("resize",this.proxy("updateHandle"))},getMinHeight:function(obj){return(obj.hasClass(CE.DragDrop.myThis.spaceClass))?this.spaceMinHeight:this.minHeight},makeResizable:function(obj){var rowWidthPiece=obj.parent(".mp-row-fluid.motopress-row").width()/100;var colWidth=rowWidthPiece*CE.Grid.myThis.columnWidthPiece;var colMargin=rowWidthPiece*CE.Grid.myThis.columnMarginPiece;var gridX=colWidth+colMargin;var colHalfWidth=Math.round(colWidth/4);colHalfWidth=(colHalfWidth<colWidth)?colHalfWidth:0;obj.not("[data-motopress-wrapper-id], .motopress-empty").each(function(){$(this).resizable({grid:[gridX,10],handles:"e, s, w, se, sw",helper:"motopress-resizer-helper",minWidth:colWidth-colHalfWidth,minHeight:CE.Resizer.myThis.getMinHeight($(this)),zIndex:1002,create:function(){$(this).resizable("option","maxWidth",$(this).width());$(this).children(".ui-resizable-handle").hide()},start:function(e,ui){if(CE.Dialog.myThis.element.dialog("isOpen")){CE.Dialog.myThis.element.dialog("close")}CE.Resizer.myThis.handle=$(e.originalEvent.target);ui.element.css({position:"relative",top:0,left:0});if(!$(this).parent(".motopress-content-wrapper > .mp-row-fluid.motopress-row").length){var handleMiddleLast=$(this).parent(".mp-row-fluid.motopress-row").nextAll(".motopress-handle-middle-in:last");var minHeight=parseInt(handleMiddleLast.css("min-height"));handleMiddleLast.height(minHeight)}},stop:function(e,ui){var handleClass=parent.MP.Utils.getHandleClass(CE.Resizer.myThis.handle.prop("class").split(" "));switch(handleClass){case"ui-resizable-s":CE.Resizer.myThis.verticalResize(ui);break;case"ui-resizable-w":CE.Resizer.myThis.horizontalResize(handleClass,ui,gridX);break;case"ui-resizable-e":CE.Resizer.myThis.horizontalResize(handleClass,ui,gridX);break;case"ui-resizable-sw":CE.Resizer.myThis.verticalResize(ui);CE.Resizer.myThis.horizontalResize(handleClass,ui,gridX);break;case"ui-resizable-se":CE.Resizer.myThis.verticalResize(ui);CE.Resizer.myThis.horizontalResize(handleClass,ui,gridX);break}var resetAddedStyleProperties={};for(var i=0;i<CE.Resizer.myThis.addedStyleProperties.length;i++){resetAddedStyleProperties[CE.Resizer.myThis.addedStyleProperties[i]]=""}ui.element.css(resetAddedStyleProperties);if($(this).hasClass("ce_controls")&&!CE.Dialog.myThis.element.dialog("isOpen")){var dragHandle=ui.element.find(".motopress-drag-handle");CE.Dialog.myThis.open(dragHandle)}CE.Resizer.myThis.updateBottomInHandleMiddle();CE.Resizer.myThis.updateSplitterHeight(obj,"resize");CE.Resizer.myThis.updateHandle();parent.CE.Save.changeContent()}})})},horizontalResize:function(handleClass,ui,gridX){var originalSpanWidth=ui.originalSize.width;var originalSpanClass=parent.MP.Utils.getSpanClass(ui.element.prop("class").split(" "));var originalSpanNumber=parent.MP.Utils.getSpanNumber(originalSpanClass);var newSpanWidth=(ui.element.width()%10===0)?ui.element.width():ui.helper.width();newSpanWidth=Math.round(newSpanWidth);var newSpanNumber=Math.ceil(newSpanWidth/gridX);newSpanNumber=Math.round(newSpanNumber);var diff=Math.abs(originalSpanNumber-newSpanNumber);if(diff>0&&originalSpanWidth>newSpanWidth){ui.element.removeClass(originalSpanClass).addClass("mp-span"+newSpanNumber);var direction=null;if(handleClass==="ui-resizable-w"||handleClass==="ui-resizable-sw"){direction="west"}else{if(handleClass==="ui-resizable-e"||handleClass==="ui-resizable-se"){direction="east"}}var empty=null;if(direction==="west"){empty=ui.element.prev(".motopress-empty")}else{if(direction==="east"){empty=ui.element.next(".motopress-empty")}}if(empty.length){var originalEmptyClass=parent.MP.Utils.getSpanClass(empty.prop("class").split(" "));var originalEmptyNumber=parent.MP.Utils.getSpanNumber(originalEmptyClass);var newEmptyNumber=originalEmptyNumber+diff;empty.removeClass(originalEmptyClass).addClass("mp-span"+newEmptyNumber);this.updateSplittableOptions(emptySpanClone,null,null)}else{var emptySpanClone=CE.Resizer.myThis.emptySpan.clone();CE.DragDrop.myThis.makeEditableEmptySpan(emptySpanClone);if(direction==="west"){ui.element.before(emptySpanClone.addClass("mp-span"+diff))}else{if(direction==="east"){ui.element.after(emptySpanClone.addClass("mp-span"+diff))}}this.updateSplittableOptions(emptySpanClone,null,null)}ui.element.resizable("option","maxWidth",parseInt(newSpanWidth))}},verticalResize:function(ui){var minHeight=parseInt(ui.element.css("min-height"));if(minHeight===ui.element.height()){ui.element.css("min-height","")}var newSpanHeight=ui.element.height();ui.element.css("min-height",newSpanHeight)},makeSplittable:function(obj){var splitterStartPos=null;var splitterEndPos=null;var splitter=null;if(obj.hasClass("motopress-splitter")){splitter=obj}else{splitter=obj.find(".motopress-splitter")}var rowWidthPiece=obj.closest(".mp-row-fluid.motopress-row").width()/100;var colWidth=rowWidthPiece*CE.Grid.myThis.columnWidthPiece;var colMargin=rowWidthPiece*CE.Grid.myThis.columnMarginPiece;var gridX=Math.round(colWidth+colMargin);splitter.draggable({axis:"x",cursor:"col-resize",grid:[gridX,0],helper:"clone",zIndex:1,start:function(e,ui){if(CE.Dialog.myThis.element.dialog("isOpen")){CE.Dialog.myThis.element.dialog("close")}splitterStartPos=Math.round(ui.originalPosition.left);splitterEndPos=splitterStartPos;ui.helper.closest(".mp-row-fluid.motopress-row").find(".motopress-drag-handle").css("cursor","col-resize")},stop:function(e,ui){ui.helper.closest(".mp-row-fluid.motopress-row").find(".motopress-drag-handle").css("cursor","move");splitterEndPos=Math.round(ui.position.left);if((splitterStartPos>0&&splitterStartPos<gridX)||(splitterStartPos<0&&splitterStartPos>-gridX)){splitterStartPos=0}var diff=splitterStartPos-splitterEndPos;var currentBlock=$(this).closest('[class*="span"].motopress-span');var nextBlock=currentBlock.prev('[class*="span"].motopress-span');var curBlockOldSpan=parent.MP.Utils.getSpanNumber(parent.MP.Utils.getSpanClass(currentBlock.prop("class").split(" ")));var nextBlockOldSpan=parent.MP.Utils.getSpanNumber(parent.MP.Utils.getSpanClass(nextBlock.prop("class").split(" ")));var curBlockNewSpan=curBlockOldSpan;var nextBlockNewSpan=nextBlockOldSpan;var diffInSpan=Math.round(Math.abs(diff/gridX));var curDiffInSpan=diffInSpan;var nextDiffInSpan=diffInSpan;if(diff<0){var oldCurrentBlockSpan=null;if(curDiffInSpan>=curBlockOldSpan){if(currentBlock.hasClass("motopress-empty")){var oldCurrentBlock=currentBlock;oldCurrentBlockSpan=parent.MP.Utils.getSpanNumber(parent.MP.Utils.getSpanClass(oldCurrentBlock.prop("class").split(" ")));currentBlock=currentBlock.next();oldCurrentBlock.remove();if(currentBlock.length){curBlockOldSpan=parent.MP.Utils.getSpanNumber(parent.MP.Utils.getSpanClass(currentBlock.prop("class").split(" ")));curBlockNewSpan=curBlockOldSpan;curDiffInSpan=diffInSpan-oldCurrentBlockSpan}}else{curDiffInSpan=curBlockOldSpan-1;nextDiffInSpan=curBlockOldSpan-1}}if(currentBlock.length){if(curDiffInSpan>=curBlockOldSpan){curDiffInSpan=curBlockOldSpan-1;if(oldCurrentBlockSpan){nextDiffInSpan=diffInSpan-(diffInSpan-(oldCurrentBlockSpan+curBlockOldSpan))-1}else{nextDiffInSpan=curBlockOldSpan-1}}curBlockNewSpan-=curDiffInSpan;nextBlockNewSpan+=nextDiffInSpan;currentBlock.removeClass("mp-span"+curBlockOldSpan).addClass("mp-span"+curBlockNewSpan);nextBlock.removeClass("mp-span"+nextBlockOldSpan).addClass("mp-span"+nextBlockNewSpan)}else{nextDiffInSpan=oldCurrentBlockSpan;nextBlockNewSpan+=nextDiffInSpan;nextBlock.removeClass("mp-span"+nextBlockOldSpan).addClass("mp-span"+nextBlockNewSpan)}}else{if(diff>0){var oldNextBlockSpan=null;if(nextDiffInSpan>=nextBlockOldSpan){if(nextBlock.hasClass("motopress-empty")){var oldNextBlock=nextBlock;oldNextBlockSpan=parent.MP.Utils.getSpanNumber(parent.MP.Utils.getSpanClass(oldNextBlock.prop("class").split(" ")));nextBlock=nextBlock.prev();oldNextBlock.remove();if(nextBlock.length){nextBlockOldSpan=parent.MP.Utils.getSpanNumber(parent.MP.Utils.getSpanClass(nextBlock.prop("class").split(" ")));nextBlockNewSpan=nextBlockOldSpan;nextDiffInSpan=diffInSpan-oldNextBlockSpan}}else{curDiffInSpan=nextBlockOldSpan-1;nextDiffInSpan=nextBlockOldSpan-1}}if(nextBlock.length){if(nextDiffInSpan>=nextBlockOldSpan){nextDiffInSpan=nextBlockOldSpan-1;if(oldNextBlockSpan){curDiffInSpan=diffInSpan-(diffInSpan-(oldNextBlockSpan+nextBlockOldSpan))-1}else{curDiffInSpan=curBlockOldSpan-1}}curBlockNewSpan+=curDiffInSpan;nextBlockNewSpan-=nextDiffInSpan;currentBlock.removeClass("mp-span"+curBlockOldSpan).addClass("mp-span"+curBlockNewSpan);nextBlock.removeClass("mp-span"+nextBlockOldSpan).addClass("mp-span"+nextBlockNewSpan)}else{curDiffInSpan=oldNextBlockSpan;curBlockNewSpan+=curDiffInSpan;currentBlock.removeClass("mp-span"+curBlockOldSpan).addClass("mp-span"+curBlockNewSpan)}}}if(!currentBlock.children(".mp-row-fluid.motopress-row").length){CE.Resizer.myThis.updateResizableOptions(currentBlock,null,null)}else{currentBlock.find('[class*="span"].motopress-span:not(.motopress-empty, [data-motopress-wrapper-id])').each(function(){CE.Resizer.myThis.updateResizableOptions($(this),null,null)})}if(!nextBlock.children(".mp-row-fluid.motopress-row").length){CE.Resizer.myThis.updateResizableOptions(nextBlock,null,null)}else{nextBlock.find('[class*="span"].motopress-span:not(.motopress-empty, [data-motopress-wrapper-id])').each(function(){CE.Resizer.myThis.updateResizableOptions($(this),null,null)})}if(!CE.Dialog.myThis.element.dialog("isOpen")){var dragHandle=$(".motopress-drag-handle.motopress-selected");if(dragHandle.length&&dragHandle.closest('[class*="mp-span"]').hasClass("ce_controls")){CE.Dialog.myThis.open(dragHandle)}}CE.Resizer.myThis.updateBottomInHandleMiddle();CE.Resizer.myThis.updateSplitterHeight(currentBlock,"split");CE.Resizer.myThis.updateSplittableOptions(currentBlock,null,null,"split");CE.Resizer.myThis.updateHandle();parent.CE.Save.changeContent()}})},updateResizableOptions:function(draggableBlock,rowFrom,rowTo){$('.motopress-content-wrapper [class*="span"].motopress-span').each(function(){if(!$(this).children(".mp-row-fluid.motopress-row").length&&!$(this).hasClass("motopress-empty")){$(this).resizable("option","maxWidth",$(this).width())}})},calcSplitterOptions:function(obj,type){var elements=null;var rowWidth=null;var spanWidth=null;var spanMargin=null;var spanWidthMargin=null;var splitter=null;var splitterWidth=null;var splitterMargin=null;if(type==="column"){rowWidth=obj.parent(".mp-row-fluid.motopress-row").width();elements=obj}else{if(type==="row"){rowWidth=obj.width();elements=obj.children('[class*="span"].motopress-span')}else{return false}}var rowWidthPiece=rowWidth/100;spanWidth=rowWidthPiece*CE.Grid.myThis.columnWidthPiece;spanMargin=rowWidthPiece*CE.Grid.myThis.columnMarginPiece;spanWidthMargin=spanWidth+spanMargin;splitterWidth=rowWidthPiece*CE.Grid.myThis.splitterWidthPiece+spanMargin;splitterMargin=-(rowWidthPiece*CE.Grid.myThis.splitterMarginPiece+spanMargin/2);elements.each(function(){splitter=$(this).find(".motopress-helper > .motopress-splitter");CE.Resizer.myThis.makeSplittable(splitter);splitter.width(splitterWidth);splitter.css("margin-left",splitterMargin+"px");if(!$(this).children(".mp-row-fluid.motopress-row").length){CE.Resizer.myThis.makeResizable($(this))}})},updateSplittableOptions:function(block,rowFrom,rowTo,action){if(typeof action==="undefined"){action="default"}if(action==="init"||action==="split"){var rows=null;if(action==="init"){rows=$(".motopress-content-wrapper .mp-row-fluid.motopress-row")}else{if(action==="split"){var necessaryRow=block.parents(".mp-row-fluid.motopress-row, .motopress-content-wrapper").eq(-2);if(typeof necessaryRow!=="undefined"){rows=$.merge($.merge([],necessaryRow),necessaryRow.find(".mp-row-fluid.motopress-row"))}}}if(rows&&typeof rows!=="undefined"){$.each(rows,function(){CE.Resizer.myThis.calcSplitterOptions($(this),"row")})}}else{if(block){this.calcSplitterOptions(block,"column")}if(rowFrom){$.each($.merge($.merge([],rowFrom),rowFrom.find(".mp-row-fluid.motopress-row")),function(){CE.Resizer.myThis.calcSplitterOptions($(this),"row")})}if(rowTo){$.each($.merge($.merge([],rowTo),rowTo.find(".mp-row-fluid.motopress-row")),function(){CE.Resizer.myThis.calcSplitterOptions($(this),"row")})}}},updateSplitterHeight:function(obj,action){var t=setTimeout(function(){var necessaryRow=null;necessaryRow=$(".motopress-content-wrapper .mp-row-fluid.motopress-row");$.each(necessaryRow,function(){var spans=$(this).children('[class*="span"].motopress-span');var spanMargin=$(this).width()/100*CE.Grid.myThis.columnMarginPiece;spans.find(".motopress-splitter").height($(this).height());spans.find(".motopress-handle-intermediate").css({width:spanMargin,height:$(this).height(),left:-spanMargin})});clearTimeout(t)},50)},updateHandle:function(){var t=setTimeout(function(){if(!CE.DragDrop.myThis.isEmptyScene()){var spanOffset=$('.motopress-content-wrapper [class*="span"].motopress-span:first').offset();var leftBarWidth=CE.LeftBar.myThis.leftBar.width();var handleWrapperWidth=$(".motopress-handle-wrapper-left:first, .motopress-handle-wrapper-right:first").width();var handleOffset=spanOffset.left-leftBarWidth-(parent.CE.Navbar.myThis.scrollWidth/2);var handleWidth=handleOffset-handleWrapperWidth;$(".motopress-content-wrapper > .mp-row-fluid.motopress-row").each(function(){var handleHeight=$(this).height();$(this).children('[class*="span"].motopress-span:first, [class*="span"].motopress-span:last').each(function(){$(this).children(".motopress-wrapper-helper, .motopress-helper").each(function(){var width=($(this).hasClass("motopress-wrapper-helper"))?handleWidth:handleOffset;$(this).find(".motopress-handle-left, .motopress-handle-right").each(function(){var side=($(this).hasClass("motopress-handle-left"))?"left":"right";var properties={width:width,height:handleHeight};properties[side]=-handleOffset;$(this).css(properties)})})})});var container=$("#motopress-container");var handleMiddleWidth=container.parent().width()-parent.CE.Navbar.myThis.scrollWidth;var handleMiddleFirst=$(".motopress-content-wrapper > .motopress-handle-middle-in:first");var handleMiddleLast=$(".motopress-content-wrapper > .motopress-handle-middle-in:last");var handleMiddlePrevLast=handleMiddleLast.prevAll(".motopress-handle-middle-in:first");if(handleMiddlePrevLast[0]!==handleMiddleFirst[0]){handleMiddlePrevLast.css({width:"",left:"",height:""})}var htmlHeight=$("html").height();var containerTop=parseInt(container.css("top"));var handleMiddleLastHeight=htmlHeight-handleMiddleLast.offset().top;if(htmlHeight<containerTop+container.outerHeight(true)){handleMiddleLastHeight+=containerTop}handleMiddleFirst.css({width:handleMiddleWidth,left:-handleOffset});handleMiddleLast.css({width:handleMiddleWidth,left:-handleOffset,height:handleMiddleLastHeight})}clearTimeout(t)},50)},updateBottomInHandleMiddle:function(){var t=setTimeout(function(){if(!CE.DragDrop.myThis.isEmptyScene()){$(".motopress-content-wrapper .mp-row-fluid.motopress-row").each(function(){var spans=$(this).children('[class*="span"].motopress-span');var emptySpanHeight=Math.max.apply(Math,spans.not(".motopress-empty").map(function(){return $(this).height()}).get());spans.filter(".motopress-empty").height(emptySpanHeight)});$(".motopress-content-wrapper > .mp-row-fluid.motopress-row").each(function(){CE.Resizer.myThis.setHandleHeight($(this))})}clearTimeout(t)},50)},setHandleHeight:function(row){var minHeight=parseInt(row.find(".motopress-handle-middle-in:last").css("min-height"));row.find(".motopress-handle-middle-in").each(function(){$(this).height(minHeight)});row.children('[class*="span"].motopress-span:not(".motopress-empty")').each(function(){var childRow=$(this).children(".mp-row-fluid.motopress-row");var rowHeight=null;var spanHeight=null;var minHeight=null;var space=0;var height=null;if(childRow.length){var handleMiddleLast=$(this).children(".motopress-handle-middle-in:last");minHeight=parseInt(handleMiddleLast.css("min-height"));rowHeight=row.height();spanHeight=$(this).height();if(spanHeight<rowHeight){space=rowHeight-spanHeight}height=space+minHeight;handleMiddleLast.height(height);childRow.each(function(){CE.Resizer.myThis.setHandleHeight($(this))})}else{var bottomIn=$(this).find(".motopress-handle-bottom-in");minHeight=parseInt(bottomIn.css("min-height"));rowHeight=row.height();spanHeight=$(this).height();if(spanHeight<rowHeight){space=rowHeight-spanHeight}height=space+minHeight;bottomIn.css({bottom:-space,height:height})}})}})});