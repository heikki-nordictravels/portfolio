import CodeInspector from './CodeInspector';
const Footer = () => {
    return(        
        <div className='hidden lg:block'>
            <footer className="block footer relative z-0 w-full items-right">
                <div className="fixed bottom-0 z-0 right-0 max-w-md max-h-64">
                    <CodeInspector />
                </div>
            </footer>
        </div>
    )
}
export default Footer;